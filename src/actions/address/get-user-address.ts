
import prisma from '@/lib/prisma'

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({where: {userId}})
    if (!address) return {}
    return {
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      address2: address.address2,
      postalCode: address.postalCode,
      city: address.city,
      country: address.countryId,
      phone: address.phone,
    }
  } catch (error) {
    console.log(error)
    return {}
  }
}