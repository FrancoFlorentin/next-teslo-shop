'use server'

import prisma from '@/lib/prisma'

export const deleteUserAddress = async (userId: string) => {
  try {
    const savedAddress = await prisma.userAddress.findUnique({where: {userId}})
    
    if (!savedAddress) return

    await prisma.userAddress.delete({where: {userId}})

    return {
      ok: true,
      message: "Dirección eliminada correctamente"
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: "No se pudo eliminar la dirección"
    }
  }
}