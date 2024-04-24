import { getOrderById } from "@/actions/order/get-order-by-id";
import { OrderStatus, PayPalButton, Title } from "@/components";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { redirect } from "next/navigation";


interface Props {
  params: {
    id: string;
  }
}

export default async function OrdersPage({ params }: Props) {

  const { id } = params;
  
  const {ok, order} = await getOrderById(id)

  if (!ok) redirect('/')

  const address = order!.OrderAddress

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split('-').at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order!.isPaid} />

            {/* Items */}
            {
              order!.OrderItem.map(product => (
                <div
                  key={product.product.slug + '-' + product.size}
                  className="flex mb-5"
                >
                  <Image
                    src={`/products/${product.product.ProductImage[0].url}`}
                    alt={product.product.title}
                    width={100}
                    style={{
                      width: "100px",
                      height: "100px"
                    }}
                    height={100}
                    className="mr-5 rounded"
                  />

                  <div>
                    <p>{product.product.title}</p>
                    <p>{currencyFormat(product.price)} x {product.quantity}</p>
                    <p className="font-bold">Subtotal: {currencyFormat(product.price * product.quantity)}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2 font-bold">Direccion de entrega</h2>
            <div className="mb-10 ">
              <p className="text-xl">{address!.firstName} {address!.lastName}</p>
              <p>{address!.address}</p>
              <p>{address!.address2 ? address!.address2 : '-'}</p>  
              <p>{address!.postalCode}</p>
              <p>{address!.city}, {address!.countryId}</p>
              <p>{address!.phone}</p>
            </div>

            {/* divider */}
            <div 
              className="w-full h-0.5 rounded bg-gray-200 mb-10"
            />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">{order!.itemsInOrder === 1 ? '1 artículo' : `${order!.itemsInOrder} artículos`}</span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subTotal)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="text-right mt-4 text-2xl">{currencyFormat(order!.total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full ">
              {
                order?.isPaid 
                ? <OrderStatus isPaid={order!.isPaid} />
                : <PayPalButton
                    amount={order!.total}
                    orderId={order!.id}
                  />
              }
              
            </div>
          </div>

        </div>
      </div>        
    </div>
  )
}
