'use client';

import React, { useState } from 'react';
import { Child, RoutineTask, RewardItem } from '@/lib/types';

interface ChildModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeChildId?: string;
  childrenData: Child[];
  tasks: RoutineTask[];
  rewards: RewardItem[];
  onCompleteTaskByChild: (taskId: string) => void;
  onRequestRewardByChild: (rewardId: string) => void;
}

export default function ChildModeModal({
  isOpen,
  onClose,
  activeChildId = 'lucas',
  childrenData,
  tasks,
  rewards,
  onCompleteTaskByChild,
  onRequestRewardByChild,
}: ChildModeModalProps) {
  const [selectedChildId, setSelectedChildId] = useState(activeChildId);
  const [tab, setTab] = useState<'tasks' | 'store'>('tasks');

  if (!isOpen) return null;

  const currentChild =
    childrenData.find((c) => c.id === selectedChildId) || childrenData[0];

  const childTasks = tasks.filter((t) => t.childId === currentChild.id);
  const availableRewards = rewards.filter((r) => r.status === 'available');

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#f7f9fb] rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Child Mode Top Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-5 text-slate-900 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <img
              src={currentChild.avatar}
              alt={currentChild.name}
              className="w-12 h-12 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-[#191c1e] tracking-tight">
                  Painel de {currentChild.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/80 font-bold text-xs text-amber-900">
                  {currentChild.level}
                </span>
              </div>
              <div className="text-xs font-semibold text-amber-950 flex items-center gap-1.5 mt-0.5">
                <span>🔥 {currentChild.streakDays} dias de sequência</span>
                <span>•</span>
                <span>{currentChild.age}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Voltar aos Pais</span>
          </button>
        </div>

        {/* Balance & Switcher Bar */}
        <div className="bg-white px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Alternar Filho:</span>
            {childrenData.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChildId(c.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  c.id === currentChild.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
            <span
              className="material-symbols-outlined text-amber-500 text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              toll
            </span>
            <span className="text-xs text-amber-800 font-bold">Meu Saldo:</span>
            <span className="text-base font-extrabold text-amber-900">
              {currentChild.balance} pts
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-100 shrink-0">
          <button
            onClick={() => setTab('tasks')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              tab === 'tasks'
                ? 'border-amber-500 bg-white text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">checklist</span>
            <span>Minhas Rotinas de Hoje ({childTasks.length})</span>
          </button>
          <button
            onClick={() => setTab('store')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              tab === 'store'
                ? 'border-amber-500 bg-white text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">redeem</span>
            <span>Loja de Recompensas</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {tab === 'tasks' ? (
            <div className="space-y-4">
              {/* Child Tasks Summary Chips */}
              <div className="flex items-center gap-2 flex-wrap pb-1">
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-500">list_alt</span>
                  <span>Total: {childTasks.length}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">schedule</span>
                  <span>Em auditoria: {childTasks.filter((t) => t.status === 'pending').length}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  <span>Aprovadas: {childTasks.filter((t) => t.status === 'approved').length}</span>
                </div>
                {childTasks.filter((t) => t.status === 'todo' || (!t.status && t.status !== 'pending' && t.status !== 'approved')).length > 0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">pending_actions</span>
                    <span>A Fazer: {childTasks.filter((t) => t.status === 'todo' || (!t.status && t.status !== 'pending' && t.status !== 'approved')).length}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {childTasks.map((t) => {
                  const isApproved = t.status === 'approved';
                  const isPending = t.status === 'pending';
                  const isRejected = t.status === 'rejected';
                  const isTodo = !isApproved && !isPending && !isRejected;

                  return (
                    <div
                      key={t.id}
                      className={`bg-white rounded-2xl p-4 border transition-all flex flex-col gap-3 ${
                        isApproved
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : isPending
                          ? 'border-amber-300 bg-amber-50/30'
                          : isRejected
                          ? 'border-rose-200 bg-rose-50/30'
                          : 'border-slate-200 shadow-xs hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm sm:text-base text-slate-900">
                              {t.title}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                              {t.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 italic">&ldquo;{t.criteria}&rdquo;</p>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>Horário limite: {t.limitTime}</span>
                            <span>•</span>
                            <span className="text-amber-700 font-bold">+{t.points} pontos</span>
                          </div>
                        </div>

                        {/* Action / Status Badge */}
                        <div className="shrink-0 flex items-center">
                          {isApproved ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                                <span className="material-symbols-outlined text-[16px]">verified</span>
                                <span>Aprovada!</span>
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700">
                                +{t.points} pts liberados
                              </span>
                            </div>
                          ) : isPending ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                                <span className="material-symbols-outlined text-[16px] text-amber-700">
                                  schedule
                                </span>
                                <span>Em auditoria</span>
                              </span>
                              <span className="text-[10px] font-semibold text-amber-800 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                <span>Aguardando pais</span>
                              </span>
                            </div>
                          ) : isRejected ? (
                            <div className="flex flex-col items-end gap-1.5">
                              <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">info</span>
                                <span>Requer Ajustes</span>
                              </span>
                              <button
                                id={`btn-confirm-task-${t.id}`}
                                onClick={() => onCompleteTaskByChild(t.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">refresh</span>
                                <span>Confirmar Novamente</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              id={`btn-confirm-task-${t.id}`}
                              onClick={() => onCompleteTaskByChild(t.id)}
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <span className="material-symbols-outlined text-[18px]">check_circle</span>
                              <span>Confirmar Tarefa</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Informational Banner for Pending Status */}
                      {isPending && (
                        <div className="text-xs text-amber-900 bg-amber-100/70 border border-amber-300/60 px-3 py-2 rounded-xl flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0">
                            hourglass_top
                          </span>
                          <span>
                            Você já confirmou esta rotina! Seus pais receberam uma notificação e estão auditando para liberar seus <strong>+{t.points} pontos</strong>.
                          </span>
                        </div>
                      )}

                      {/* Feedback from parents when approved */}
                      {isApproved && t.feedback && (
                        <div className="text-xs text-emerald-900 bg-emerald-100/60 border border-emerald-300/60 px-3 py-2 rounded-xl flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-emerald-700 shrink-0">
                            thumb_up
                          </span>
                          <span>Feedback dos pais: &ldquo;{t.feedback}&rdquo;</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableRewards.map((r) => {
                const canAfford = currentChild.balance >= r.cost;
                return (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-[22px]">
                          {r.icon || 'redeem'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{r.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{r.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-amber-800">
                        {r.cost} pts
                      </span>
                      <button
                        onClick={() => onRequestRewardByChild(r.id)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          canAfford
                            ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs active:scale-95 cursor-pointer'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Resgatar' : 'Faltam pontos'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
