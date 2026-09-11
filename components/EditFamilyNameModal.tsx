'use client';

import React, { useState } from 'react';

interface EditFamilyNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFamilyName: string;
  onSaveFamilyName: (newName: string) => void;
}

function EditFamilyNameDialog({
  onClose,
  currentFamilyName,
  onSaveFamilyName,
}: Omit<EditFamilyNameModalProps, 'isOpen'>) {
  const [name, setName] = useState(currentFamilyName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSaveFamilyName(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed material-symbols-outlined text-[22px]">
              home
            </span>
            <div>
              <h3 className="font-bold text-base text-on-surface">Editar Nome da Família</h3>
              <p className="text-xs text-on-surface-variant">
                Atualiza o nome exibido no cabeçalho e em todo o aplicativo
              </p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Nome do Grupo Familiar *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Família Silva, Família Santos..."
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low text-sm font-bold text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-colors"
              autoFocus
            />
            <span className="text-[11px] text-on-surface-variant mt-1 block">
              Este nome aparecerá no seletor do topo do app, sidebar e notificações.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Salvar Nome</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditFamilyNameModal(props: EditFamilyNameModalProps) {
  if (!props.isOpen) return null;
  return <EditFamilyNameDialog {...props} />;
}
