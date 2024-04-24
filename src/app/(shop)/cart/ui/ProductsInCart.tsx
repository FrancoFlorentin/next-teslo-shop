'use client';

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export function ProductsInCart() {

  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore(state => state.cart);

  const router = useRouter();
  
  // if (productsInCart.length < 1) router.push('/empty')
  

  const updateProductQuantity = useCartStore(state => state.updateProductQuantity)
  const removeProduct = useCartStore(state => state.removeProduct)
  

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
            <ProductImage
              src={product.image}
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
              <Link 
                className="hover:underline"
                href={`/product/${product.slug}`}
              >
               <span className="font-bold">{product.size}</span> - {product.title}
              </Link>
              <p>${product.price}</p>
              <QuantitySelector quantity={product.quantity} onQuantityChanged={quantity => updateProductQuantity(product, quantity)} />
              <button 
                className="underline mt-3"
                onClick={() => removeProduct(product)}
              >Remover</button>
            </div>
          </div>
        ))
      }
    </>
  )
}
