'use server';

import prisma from '@/lib/prisma'

export const setTransactionId = async(orderId: string, txId: string) => {

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        transactionId: txId
      }
    })

    if (!order) {
      return {
        ok: false,
        message: "No se encontró la orden"
      }
    }

    return {
      ok: true
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: "Error al actualizar la orden"
    }
  }
}