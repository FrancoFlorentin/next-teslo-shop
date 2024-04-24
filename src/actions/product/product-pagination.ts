"use server";

import prisma from '@/lib/prisma'
import { Gender } from '@prisma/client';

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender | null;
}

export const getPaginatedProductsWithImages = async({
  page = 1,
  take = 12,
  gender = null
}: PaginationOptions) => {

  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  if (isNaN(Number(take))) take = 12;
  if (take < 1) take = 12;

  try {
    // 1. Obtener los productos
    const products = await prisma.product.findMany({
      where: gender ? {gender} : {},
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true
          }
        }
      },
      
    })
    // console.log(products)

    // 2. Obtener el total de páginas
    const totalCount = await prisma.product.count({where: gender ? {gender}: {} });
    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map(product => ({
        ...product,
        images: product.ProductImage.map(image => image.url)
      }))
    }
  } catch (error) {
    throw new Error('No se pudo cargar los productos')
  }

  
}