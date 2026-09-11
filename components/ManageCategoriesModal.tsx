'use client';

import React, { useState } from 'react';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onAddCategory: (categoryName: string) => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
}

export default function ManageCategoriesModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: ManageCategoriesModalProps) {
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert('Esta categoria já existe!');
      return;
    }
    onAddCategory(trimmed);
    setNewCatName('');
  };

  const handleStartEdit = (cat: string) => {
    setEditingCat(cat);
    setEditInput(cat);
  };

  const handleSaveEdit = (oldCat: string) => {
    const trimmed = editInput.trim();
    if (!trimmed || trimmed === oldCat) {
      setEditingCat(null);
      return;
    }
    onEditCategory(oldCat, trimmed);
    setEditingCat(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed material-symbols-outlined text-[22px]">
              category
            </span>
            <div>
              <h3 className="font-bold text-base text-on-surface">Gerenciar Categorias</h3>
              <p className="text-xs text-on-surface-variant">Cadastre, renomeie ou exclua categorias</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            required
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Nova categoria (ex: Leitura, Esportes, Pet)"
            className="flex-1 h-10 px-3 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
          />
          <button
            type="submit"
            className="px-4 h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-2xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Adicionar</span>
          </button>
        </form>

        {/* List of Existing Categories */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
            Categorias Cadastradas ({categories.length})
          </span>

          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 group"
            >
              {editingCat === cat ? (
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs font-bold rounded bg-surface-container-lowest border border-primary text-on-surface outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(cat)}
                    className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                    title="Salvar"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCat(null)}
                    className="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
                    title="Cancelar"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-xs font-bold text-on-surface">{cat}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container transition-colors cursor-pointer"
                      title="Editar Categoria"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Excluir a categoria "${cat}"?`)) {
                            onDeleteCategory(cat);
                          }
                        }}
                        className="p-1 text-on-surface-variant hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Excluir Categoria"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-outline-variant/20 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold transition-colors cursor-pointer"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
}
