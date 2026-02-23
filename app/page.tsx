'use client';
import { useEffect, useState } from 'react';
import { useTodoStore } from '@/store/useTodoStore';
import { api } from '@/services/api';

export default function TodoPage() {
  const { todos, fetchTodos, addTodo, updateTodo, deleteTodo, isLoading } = useTodoStore();
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

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
    const updated = await api.put(`/api/todos/${todo.id}`, { 
      title: todo.title,
      status: !todo.status 
    });
    updateTodo(updated);
  };

  const handleEdit = (todo: any) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) return;
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updated = await api.put(`/api/todos/${id}`, { 
      title: editTitle,
      status: todo.status 
    });
    updateTodo(updated);
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/api/todos/${id}`);
    deleteTodo(id);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-8 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Medyanes 360 Task
          </h1>
          <p className="text-center text-gray-500 mb-8">Günlük görevlerini yönet.</p>

          <form onSubmit={handleAdd} className="flex gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Yeni bir görev ekle"
              className="flex-1 p-3 pl-4 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!title.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ekle
            </button>
          </form>
        </div>

        <div className="p-8 bg-white min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Yükleniyor</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center space-y-4">
              <p className="text-gray-400">Henüz bir görev yok</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group flex items-center justify-between p-4 rounded-lg border transition-colors ${todo.status
                      ? 'bg-gray-50 border-gray-100'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => handleToggle(todo)}
                      className={`relative shrink-0 w-5 h-5 rounded border transition-colors flex items-center justify-center ${todo.status
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-400 hover:border-blue-500'
                        }`}
                    >
                      {todo.status && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    {editingId === todo.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdate(todo.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                          className="flex-1 p-2 rounded border border-blue-500 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleUpdate(todo.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`text-base transition-colors select-none ${todo.status
                            ? 'line-through text-gray-400'
                            : 'text-gray-700'
                          }`}
                      >
                        {todo.title}
                      </span>
                    )}
                  </div>
                  {editingId !== todo.id && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="Görevi Düzenle"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Görevi Sil"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-3 border-t border-gray-100 text-center text-xs text-gray-400">
          {todos.filter(t => !t.status).length} aktif görev
        </div>
      </div>
    </main>
  );
}