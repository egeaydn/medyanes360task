'use client';
import { useEffect, useState } from 'react';
import { useTodoStore } from '@/store/useTodoStore';
import { api } from '@/services/api';

export default function TodoPage() {
  const { todos, fetchTodos, addTodo, updateTodo, deleteTodo, isLoading } = useTodoStore();
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo = await api.post('/api/todos', { title });
    addTodo(newTodo);
    setTitle('');
  };

  const handleToggle = async (todo: any) => {
    const updated = await api.put(`/api/todos/${todo.id}`, { status: !todo.status });
    updateTodo(updated);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/api/todos/${id}`);
    deleteTodo(id); 
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Medyanes 360 Task</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Yeni bir görev yaz..."
          className="flex-1 p-2 border rounded text-black outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ekle
        </button>
      </form>

      {isLoading ? (
        <p className="text-center">Yükleniyor...</p>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center justify-between p-4 bg-gray-100 rounded border border-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.status}
                  onChange={() => handleToggle(todo)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className={todo.status ? 'line-through text-gray-500' : 'text-black'}>
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}