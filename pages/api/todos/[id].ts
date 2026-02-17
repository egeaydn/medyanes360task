import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query // URL'deki id'yi alır

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Geçersiz ID' })
  }

  // PUT: Mevcut bir todoyu güncelle (örn: durumunu değiştir)
  if (req.method === 'PUT') {
    const { title, description, status } = req.body
    try {
      const updatedTodo = await prisma.todo.update({
        where: { id: id },
        data: { title, description, status }
      })
      return res.status(200).json(updatedTodo)
    } catch (error) {
      return res.status(500).json({ error: 'Güncelleme yapılamadı' })
    }
  }

  // DELETE: Bir todoyu sil
  if (req.method === 'DELETE') {
    try {
      await prisma.todo.delete({
        where: { id: id }
      })
      return res.status(200).json({ message: 'Başarıyla silindi' })
    } catch (error) {
      return res.status(500).json({ error: 'Silme işlemi başarısız' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}