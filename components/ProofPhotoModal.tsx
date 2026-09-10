'use client';

import React from 'react';
import { RoutineTask } from '@/lib/types';

interface ProofPhotoModalProps {
  task: RoutineTask | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestNewPhoto: (taskId: string) => void;
  onDirectApprove: (taskId: string) => void;
}

export default function ProofPhotoModal({
  task,
  isOpen,
  onClose,
  onRequestNewPhoto,
  onDirectApprove,
}: ProofPhotoModalProps) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#081534] text-[24px]">
              photo_camera
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">Evidência Fotográfica</h3>
              <p className="text-xs text-slate-500">
                {task.title} • {task.childName} ({task.code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Image Preview / Placeholder */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-200">
          {task.proofPhotoUrl ? (
            <img
              src={task.proofPhotoUrl}
              alt="Evidência fotográfica"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 text-slate-300">
              <span className="material-symbols-outlined text-[40px] text-slate-400 mb-2">
                hide_image
              </span>
              <p className="text-xs font-semibold">Nenhuma foto enviada ainda pela criança</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Você pode solicitar uma foto de comprovação antes de liberar os pontos.
              </p>
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-emerald-400">
              schedule
            </span>
            <span>Registrado às {task.completedAt}</span>
          </div>
        </div>

        {/* Criteria reminder */}
        <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
          <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
            Critério a verificar:
          </span>
          <p className="text-slate-600 italic">&ldquo;{task.criteria}&rdquo;</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              onRequestNewPhoto(task.id);
              onClose();
            }}
            className="px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">notifications_active</span>
            <span>Solicitar Nova Foto ao Filho</span>
          </button>

          <button
            onClick={() => {
              onDirectApprove(task.id);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#081534] hover:bg-[#1e2a4a] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span>Aprovar com Evidência (+{task.points} pts)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
