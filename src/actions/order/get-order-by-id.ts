'use server';

import prisma from '@/lib/prisma'
import { auth } from "@/auth.config";

export const getOrderById = async (id: string) => {
  const session = await auth()
  if (!session?.user) {
    return {
      ok: false,
      message: "No hay sesion de usuario"
    }
  }

  try {
    const order = await prisma.order.findUnique({
      where: {id},
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,

                ProductImage: {
                  select: {
                    url: true
                  },
                  take: 1
                }
              }
            }
          }
        }
      }
    });

    if (!order) throw `${id}. No existe`

    if (session.user.role === 'user') {
      if (session.user.id !== order.userId) {
        throw `${id} No es de ese usuario`
      }
    } 

    return {
      ok: true,
      order: order
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: "Orden no existe"
    }
  }
}