'use client';

import React, { useState, useEffect } from 'react';
import { RoutineTask, Child } from '@/lib/types';

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: RoutineTask | null;
  childrenData: Child[];
  categories: string[];
  onSaveTask: (task: RoutineTask) => void;
  onDeleteTask: (taskId: string) => void;
}

function EditActivityDialog({
  onClose,
  task,
  childrenData,
  categories,
  onSaveTask,
  onDeleteTask,
}: Omit<EditActivityModalProps, 'isOpen'> & { task: RoutineTask }) {
  const [title, setTitle] = useState(task.title || '');
  const [childId, setChildId] = useState(task.childId || childrenData[0]?.id || 'lucas');
  const [category, setCategory] = useState(task.category || categories[0] || 'Organização');
  const [points, setPoints] = useState(task.points || task.basePoints || 50);
  const [limitTime, setLimitTime] = useState(task.limitTime || '20:00');
  const [criteria, setCriteria] = useState(task.criteria || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const child = childrenData.find((c) => c.id === childId) || childrenData[0];

    const updatedTask: RoutineTask = {
      ...task,
      title: title.trim(),
      childId: child.id,
      childName: child.name,
      avatar: child.avatar,
      category,
      points: Number(points),
      basePoints: Number(points),
      limitTime,
      criteria: criteria.trim() || 'Cumprir os passos estabelecidos.',
      timingLabel: `Enviado hoje (Limite: ${limitTime})`,
    };

    onSaveTask(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed material-symbols-outlined text-[22px]">
              edit_note
            </span>
            <div>
              <h3 className="font-bold text-base text-on-surface">Editar Atividade / Rotina</h3>
              <p className="text-xs text-on-surface-variant">Código {task.tarCode} • {task.code}</p>
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
              Título da Atividade *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Arrumar a cama ao acordar"
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-sm font-semibold text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Responsável
              </label>
              <select
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 outline-none cursor-pointer"
              >
                {childrenData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.age})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Valor da Tarefa (Pontos)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Horário Limite Diário
              </label>
              <input
                type="time"
                value={limitTime}
                onChange={(e) => setLimitTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Critérios de Aceite Pedagógicos
            </label>
            <textarea
              rows={3}
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Ex: Lençol esticado, travesseiro alinhado e chão sem brinquedos."
              className="w-full p-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-3">
            <div>
              {showConfirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteTask(task.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Confirmar Exclusão
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-2 py-1.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Excluir Atividade</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
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
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditActivityModal(props: EditActivityModalProps) {
  if (!props.isOpen || !props.task) return null;
  return <EditActivityDialog {...props} task={props.task} />;
}
