export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  searchParams: {
    page?: string;
  }
}


export default async function Home({ searchParams }: Props) {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({page});

  if (products.length === 0) {
    redirect('/')
  }

  return (
    <div className="">
      <Title 
        title="Tienda"
        subtitle="Todos los productos"
        className="mb-2"
      /> 

      <Suspense fallback={<p>Cargando...</p>}> 
        <ProductGrid products={products} />
      </Suspense>


      <Pagination totalPages={totalPages} />
    </div>
  );
}
