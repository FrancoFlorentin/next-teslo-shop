export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { Gender } from "@prisma/client";
import { notFound } from "next/navigation";

interface Props {
  searchParams: {
    page?: string
  },
  params: {
    gender: Gender;
  }
}

export default async function GenderPage({searchParams, params}: Props) {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const gender = params.gender;
 
  const pages = ['men', 'women', 'kid'];
  if (!pages.includes(params.gender)) {
    notFound()
  }

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({page, gender});
  // console.log(products.length)


  const labels: Record<Category, string> = {
    "men": "para hombres",
    "women": "para mujeres",
    "kid": "para niños", 
    "unisex": "unisex"
  }

  return (
    <div>
      <Title
        title={`Artículos ${labels[params.gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </div>
  )
}
