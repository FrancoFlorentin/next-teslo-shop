'use server'

import type { Address } from "@/interfaces"
import prisma from '@/lib/prisma'

export const setUserAddresss = async (address: Address, userId: string) => {
  try {

    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      address: newAddress
    }
    
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo grabar la dirección'
    }
  }
}

const createOrReplaceAddress = async(address: Address, userId: string) => {
  try {

    // Buscar address
    const storedAddress = await prisma.userAddress.findUnique({
      where: {
        userId
      }
    });

    const addressToSave = {
      userId: userId,
      address: address.address,
      countryId: address.country,
      city: address.city,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone, 
      postalCode: address.postalCode,
      address2: address.address2
    }

    // Si no existe en la base de datos crear una nueva
    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave 
      })

      return newAddress
    }

    // Si existe en la base de datos actualizarla
    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave
    })

    return updatedAddress
  } catch (error) {
    console.log(error)
    throw new Error('No se pudo grabar la dirección')
  }
}