import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';

async function main() {

  // 1. Borrar registros previos
  await Promise.all([
    prisma.orderAddress.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),

    prisma.userAddress.deleteMany(),
    prisma.country.deleteMany(),
    prisma.user.deleteMany(),
    
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.productImage.deleteMany(),
  ])

  const { categories, products, users } = initialData

  // Countries
  await prisma.country.createMany({data: countries})

  // Usuarios
  await prisma.user.createMany({data: users})

  // Categorias
  const categoriesData = categories.map(category => ({
    name: category
  }))

  await prisma.category.createMany({data: categoriesData})

  const categoriesDB = await prisma.category.findMany()

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map
  }, {} as Record<string, string>) // <string=shirt, string=categoryID>

  // Products
  products.forEach(async(product) => {
    const { images, type, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type]
      }
    })

    // Images
    const imagesData = images.map(image => ({
      url: image,
      productId: dbProduct.id
    }))

    await prisma.productImage.createMany({
      data: imagesData
    })
  })


  console.log("Seed ejecutado correctamente")
}



(() => {
  if (process.env.NODE_ENV === 'production') return
  main()
})();