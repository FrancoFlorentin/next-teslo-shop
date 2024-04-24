'use server';

import prisma from '@/lib/prisma'
import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size
}


export const confirmOrder = async (productIds: ProductToOrder[], address: Address) => {

  const session = await auth()
  const userId = session?.user.id
  if (!userId) {
    return {
      ok: false,
      message: "No hay sesión de usuario"
    }
  }

  // Obtener la información de los productos
  // Nota: Recordar que podemos llevar +2 productos con el mismo ID
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map( item => item.productId )
      }
    }
  })

  // Calcular los montos / Encabezado
  const itemsInOrder = productIds.reduce((count, item) => count + item.quantity, 0)

  // Los totales de tax, subtotal y total
  const { subTotal, tax, total } = productIds.reduce((totals, item) => {

    const productQuantity = item.quantity;
    const product = products.find(p => p.id === item.productId)

    if (!product) throw new Error(`${item.productId} no existe - 500`)

    const subTotal = product.price * productQuantity

    totals.subTotal += subTotal;
    totals.tax += subTotal * 0.15;
    totals.total += subTotal * 1.15;

    return totals
  }, {subTotal: 0, tax: 0, total: 0})


  try {
    // Crear la transacción de base de datos
    const prismaTx = await prisma.$transaction(async(tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map(async(product) => {
  
        // Acumular los valores
        const productQuantity = productIds.filter(
          p => p.productId === product.id
        ).reduce( (ac, item) => item.quantity + ac, 0 )
  
        if (productQuantity === 0) {
          throw new Error(`${product.id}, no tiene cantidad definida`)
        }
  
        return tx.product.update({
          where: {id: product.id},
          data: {
            // inStock: product.inStock - productQuantity NO HACER
            inStock: {
              decrement: productQuantity
            }
          }
        })
      });
  
      const updatedProducts = await Promise.all(updatedProductsPromises)
  
      // Verificar valores negativos en la existencia = no hay stock
      updatedProducts.forEach(product => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene inventario suficiente`);
        }
      })
  
      // 2. Crear la orden - Encabezado - Detalle
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,
  
          OrderItem: {
            createMany: {
              data: productIds.map(p => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price: products.find(product => product.id === p.productId)?.price ?? 0
              }))
            }
          }
        }
      })
  
      // 3. Crear la direccion de la orden
      const { country, ...restAddress } = address
  
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id
        }
      })
  
      return {
        upadatedProducts: updatedProducts,
        order: order,
        orderAddress: orderAddress
      }      
    })

    return {
      ok: true,
      order: prismaTx.order.id,
      prismaTx: prismaTx
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    }
  }
}