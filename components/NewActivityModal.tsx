'use client';

import React, { useState } from 'react';
import { Child, RoutineTask, TaskCategory } from '@/lib/types';

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  childrenData: Child[];
  categories?: string[];
  onAddTask: (newTask: RoutineTask) => void;
}

export default function NewActivityModal({
  isOpen,
  onClose,
  childrenData,
  categories = ['Organização', 'Estudos', 'Higiene', 'Convivência', 'Saúde'],
  onAddTask,
}: NewActivityModalProps) {
  const [title, setTitle] = useState('');
  const [childId, setChildId] = useState(childrenData[0]?.id || 'lucas');
  const [category, setCategory] = useState<string>(categories[0] || 'Organização');
  const [points, setPoints] = useState(50);
  const [limitTime, setLimitTime] = useState('20:00');
  const [criteria, setCriteria] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const child = childrenData.find((c) => c.id === childId) || childrenData[0];
    const newId = `card-reg-${Date.now()}`;
    const randReg = Math.floor(1000 + Math.random() * 9000);
    const randTar = Math.floor(10 + Math.random() * 90);

    const task: RoutineTask = {
      id: newId,
      code: `#REG-${randReg}`,
      tarCode: `TAR-0${randTar}`,
      title: title.trim(),
      category,
      childId: child.id,
      childName: child.name,
      avatar: child.avatar,
      points: Number(points),
      basePoints: Number(points),
      status: 'pending',
      onTime: true,
      timingLabel: `Enviado hoje (Limite: ${limitTime})`,
      criteria: criteria.trim() || 'Executar com atenção aos detalhes e organização.',
      limitTime,
      completedAt: 'Agora há pouco',
      duration: '15 min estimado',
      feedback: 'Aguardando validação do responsável.',
      hasPenalty: false,
      penaltyAmount: 0,
      proofPhotoUrl: 'https://picsum.photos/seed/task_evidence/800/600',
    };

    onAddTask(task);
    onClose();
    setTitle('');
    setCriteria('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-primary text-on-primary material-symbols-outlined text-[20px]">
              add_task
            </span>
            <div>
              <h3 className="font-bold text-base text-on-surface">Cadastrar Nova Atividade</h3>
              <p className="text-xs text-on-surface-variant">Adicione uma rotina para auditoria dos pais</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Título da Rotina / Tarefa *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Recolher brinquedos e guardar sapatos"
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-medium text-on-surface outline-none border border-outline-variant/30 focus:border-primary"
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
                Recompensa (Pontos)
              </label>
              <input
                type="number"
                required
                min={5}
                max={500}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-sm font-bold text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
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
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 focus:border-primary outline-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Critérios de Aceite Pedagógicos
            </label>
            <textarea
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Ex: Todos os livros devem estar nas prateleiras e cama arrumada sem rugas."
              rows={2}
              className="w-full p-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Publicar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
