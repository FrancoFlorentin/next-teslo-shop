'use client'

import { Product } from "@/interfaces"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  product: Product;
}

export function ProductGridItem({ product }: Props) {

  const [displayImage, setDisplayImage] = useState(product.images[0])

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link
        href={`/product/${product.slug}`}
        className="h-full"
      >
        {
          product.images[0]
            ? (
              <Image 
                onMouseEnter={() => setDisplayImage(product.images[1])}
                onMouseLeave={() => setDisplayImage(product.images[0])}
                src={`/products/${displayImage}`}
                alt={product.title}
                className="w-full object-cover rounded"
                width={500}
                height={500}
              />
            )
            : (
              <Image 
                src={"/imgs/placeholder.jpg"}
                alt={product.title}
                className="w-full object-cover rounded"
                width={500}
                height={500}
              />
            )
        }
        
      </Link>      

      <div className="p-4 flex flex-col">
        <Link
          href={`/product/${product.slug}`}
          className="hover:text-blue-500"
        >{product.title}</Link>

        <span className="font-bold">${product.price}</span>
      </div>
    </div>
  )
}
