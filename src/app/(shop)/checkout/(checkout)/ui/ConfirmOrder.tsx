'use client';

import { confirmOrder } from '@/actions/order/confirm-order'
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat, sleep } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export function ConfirmOrder() {

  const router = useRouter()

  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)

  const address = useAddressStore(state => state.address)
  const { subTotal, tax, total, itemsInCart } = useCartStore(state => state.getSummaryInformation())
  const cart = useCartStore(state => state.cart)
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const onConfirmOrder = async () => {
    setIsConfirmingOrder(true)
    // await sleep(2)

    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size
    }))


    //! Server Action
    const resp = await confirmOrder(productsToOrder, address)
    if (!resp.ok) {
      setIsConfirmingOrder(false);
      setErrorMessage(resp.message);
      return;
    }

    //* Todo salió bien
    clearCart()
    router.replace('/orders/' + resp.order)

  }

  if (!loaded) return <p>Cargando...</p>  

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2 font-bold">Direccion de entrega</h2>
            <div className="mb-10 ">
              <p className="text-xl">{address.firstName} {address.lastName}</p>
              <p>{address.address}</p>
              <p>{address.address2 ? address.address2 : '-'}</p>  
              <p>{address.postalCode}</p>
              <p>{address.city}, {address.country}</p>
              <p>{address.phone}</p>
            </div>

            {/* divider */}
            <div 
              className="w-full h-0.5 rounded bg-gray-200 mb-10"
            />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">{itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}</span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(subTotal)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(tax)}</span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="text-right mt-4 text-2xl">{currencyFormat(total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <p className="mb-5">
                {/* Disclaimer */}
                <span className="text-xs">
                  Al hacer click en &quot;Confirmar orden&quot;, aceptas nuestros <Link href={'#'} className="underline">términos y condiciones</Link> y <Link href={'#'} className="underline">pilítica de privacidad</Link>
                </span>
              </p>

              <p className="text-red-500">{ errorMessage }</p>

              <button 
                onClick={onConfirmOrder}
                disabled={isConfirmingOrder}
                className={`flex justify-center mx-auto ${
                  clsx({
                    "btn-primary": !isConfirmingOrder,
                    "btn-secondary": isConfirmingOrder
                  })
                }`}
              >Confirmar orden</button>
            </div>
          </div>
  )
}
