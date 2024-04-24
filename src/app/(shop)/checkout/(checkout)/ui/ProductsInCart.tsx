'use client';

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";


export function ProductsInCart() {

  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore(state => state.cart);
  
  

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) {
    return <p>Loading...</p>
  }

  return (
    <>
      {
        productsInCart.map((product) => (
          <div
            key={product.slug + '-' + product.size}
            className="flex mb-5"
          >
            <Image
              src={`/products/${product.image}`}
              alt={product.title}
              width={100}
              style={{
                width: "100px",
                height: "100px"
              }}
              height={100}
              className="mr-5 rounded"
            />

            <div>
              <p>
               <span className="font-bold">{product.size}</span> - {product.title} ({product.quantity})
              </p>
              <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>
            </div>
          </div>
        ))
      }
    </>
  )
}
