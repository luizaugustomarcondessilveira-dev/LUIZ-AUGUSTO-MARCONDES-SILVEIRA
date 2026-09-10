'use client';

import React, { useState } from 'react';
import { Child, RoutineTask, TaskCategory } from '@/lib/types';

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  childrenData: Child[];
  onAddTask: (newTask: RoutineTask) => void;
}

export default function NewActivityModal({
  isOpen,
  onClose,
  childrenData,
  onAddTask,
}: NewActivityModalProps) {
  const [title, setTitle] = useState('');
  const [childId, setChildId] = useState('lucas');
  const [category, setCategory] = useState<TaskCategory>('Organização');
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
      title,
      category,
      childId: child.id,
      childName: child.name,
      avatar: child.avatar,
      points: Number(points),
      basePoints: Number(points),
      status: 'pending',
      onTime: true,
      timingLabel: `Enviado hoje (Limite: ${limitTime})`,
      criteria: criteria || 'Executar com atenção aos detalhes e organização.',
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#081534] text-white material-symbols-outlined text-[20px]">
              add_task
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">Cadastrar Nova Atividade</h3>
              <p className="text-xs text-slate-500">Adicione uma rotina para auditoria dos pais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Título da Rotina / Tarefa
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Recolher brinquedos e guardar sapatos"
              className="w-full h-10 px-3 rounded-lg bg-slate-100 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-900/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Responsável
              </label>
              <select
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-slate-100 text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="lucas">Lucas (10 anos)</option>
                <option value="beatriz">Beatriz (7 anos)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full h-10 px-3 rounded-lg bg-slate-100 text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="Organização">Organização</option>
                <option value="Estudos">Estudos</option>
                <option value="Higiene">Higiene</option>
                <option value="Convivência">Convivência</option>
                <option value="Saúde">Saúde</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Recompensa (Pontos)
              </label>
              <input
                type="number"
                required
                min={5}
                max={500}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-slate-100 text-sm font-bold text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Horário Limite Diário
              </label>
              <input
                type="time"
                value={limitTime}
                onChange={(e) => setLimitTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-slate-100 text-xs font-bold text-slate-800 outline-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Critérios de Aceite Pedagógicos
            </label>
            <textarea
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Ex: Todos os livros devem estar nas prateleiras e cama arrumada sem rugas."
              rows={2}
              className="w-full p-3 rounded-lg bg-slate-100 text-xs text-slate-800 outline-none resize-none focus:ring-2 focus:ring-indigo-900/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#081534] hover:bg-[#1e2a4a] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Publicar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
