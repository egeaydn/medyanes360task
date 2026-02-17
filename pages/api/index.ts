import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const todos = await prisma.todo.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(todos)
    } catch (error) {
      return res.status(500).json({ error: 'Veriler çekilemedi' })
    }
  }

  if (req.method === 'POST') {
    const { title, description } = req.body
    try {
      const newTodo = await prisma.todo.create({
        data: { title, description, status: false }
      })
      return res.status(201).json(newTodo)
    } catch (error) {
      return res.status(500).json({ error: 'Todo eklenemedi' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}