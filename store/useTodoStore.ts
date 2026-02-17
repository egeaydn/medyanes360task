import { create } from 'zustand'

interface Todo {
  id: string
  title: string
  description?: string
  status: boolean
}

interface TodoState {
  todos: Todo[]
  isLoading: boolean
  fetchTodos: () => Promise<void>
  addTodo: (todo: Todo) => void
  updateTodo: (updatedTodo: Todo) => void
  deleteTodo: (id: string) => void
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  isLoading: false,

  fetchTodos: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      set({ todos: data, isLoading: false })
    } catch (error) {
      console.error('Veri çekme hatası:', error)
      set({ isLoading: false })
    }
  },

  addTodo: (todo) => 
    set((state) => ({ todos: [todo, ...state.todos] })),

  updateTodo: (updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
}))