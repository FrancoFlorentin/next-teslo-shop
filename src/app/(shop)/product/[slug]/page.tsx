export const revalidate = 604800; // 7 dias

import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";
import { SizeSelector } from '../../../../components/product/size-selector/SizeSelector';
import { ProductMobileSlideshow, ProductSlideshow, QuantitySelector, StockLabel } from "@/components";
import { getProductBySlug } from "@/actions";
import { Metadata, ResolvingMetadata } from 'next';
import { AddToCart } from "./ui/AddToCart";

interface Props {
  params: {
    slug: string;
  }
}

export async function generateMetadata({params}: Props, parent: ResolvingMetadata): Promise<Metadata> {

  const product = await getProductBySlug(params.slug);

  // const previousImage = (await parent).openGraph?.images || []

  return {
    title: `${product?.title ?? 'Producto no encontrado'} - Teslo | Shop`,
    description: `${product?.description ?? 'Producto no encontrado'}`,
    openGraph: {
      images: [`/products/${product?.images[1]}`]
    }
  }
}

export default async function ProductPage({params}: Props) {


  const { slug } = params;
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }
 
  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      {/* SlideShow */}
      <div className="col-span-1 md:col-span-2">

        {/* Mobile Slideshow */}
        <ProductMobileSlideshow 
          title={product.title} 
          images={product.images}
          className="block md:hidden"
        />

        {/* Desktop SlideShow */}
        <ProductSlideshow 
          title={product.title} 
          images={product.images} 
          className="hidden md:block"
        />

      </div> 

      {/* Detalles */}
      <div className="col-span-1 px-5">
        <StockLabel slug={product.slug} />
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>{product.title}</h1>
        <p className="text-lg">${product.price}</p>

        <AddToCart product={product} />

        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  )
}
