'use client';

import React, { useState } from 'react';
import { Child, RoutineTask, RewardItem, TaskStatus } from '@/lib/types';

interface AuditDashboardProps {
  childrenData: Child[];
  tasks: RoutineTask[];
  rewards: RewardItem[];
  selectedChildFilter: string;
  onFilterChange: (childId: string) => void;
  onApproveTask: (taskId: string, customFeedback?: string, pointsToAward?: number) => void;
  onRejectTask: (taskId: string, reason?: string) => void;
  onBatchApproveOnTime: () => void;
  onDeliverReward: (rewardId: string) => void;
  onRequestPhoto: (task: RoutineTask) => void;
  onShowToast: (title: string, desc: string, iconName?: string) => void;
  onOpenPinChangeModal: () => void;
  onEditTask?: (task: RoutineTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

// Formata data para exibição
function formatDateLabel(dateStr: string): string {
  const today = new Date();
  const selected = new Date(dateStr + 'T00:00:00');
  const todayStr = today.toISOString().split('T')[0];
  if (dateStr === todayStr) {
    return selected.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', weekday: 'long' });
  }
  return selected.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

export default function AuditDashboard({
  childrenData,
  tasks,
  rewards,
  selectedChildFilter,
  onFilterChange,
  onApproveTask,
  onRejectTask,
  onBatchApproveOnTime,
  onDeliverReward,
  onRequestPhoto,
  onShowToast,
  onOpenPinChangeModal,
  onEditTask,
  onDeleteTask,
}: AuditDashboardProps) {
  const [activeTab, setActiveTab] = useState<TaskStatus>('pending');

  // ─── Seletor de Data ──────────────────────────────────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [feedbackValues, setFeedbackValues] = useState<Record<string, string>>({
    'card-reg-1082': 'Muito bem organizado hoje!',
    'card-reg-1083': 'Excelente resolução, mas atenção ao horário!',
    'card-reg-1084': 'Rotina noturna completa.',
    'card-reg-1085': 'Estojo abastecido, livros guardados.',
  });

  const [penaltyToggles, setPenaltyToggles] = useState<Record<string, boolean>>({
    'card-reg-1083': true,
  });

  const [pinInput, setPinInput] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<boolean>(false);

  // ─── Filtros ──────────────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter((task) => {
    const matchChild = selectedChildFilter === 'all' || task.childId === selectedChildFilter;
    const matchTab = task.status === activeTab;
    return matchChild && matchTab;
  });

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const onTimeCount = pendingTasks.filter((t) => t.onTime).length;
  const delayedCount = pendingTasks.filter((t) => !t.onTime).length;
  const approvedTodayCount = tasks.filter((t) => t.status === 'approved').length;
  const rejectedCount = tasks.filter((t) => t.status === 'rejected').length;
  const pendingRewards = rewards.filter((r) => r.status === 'pending');

  // ─── PIN ─────────────────────────────────────────────────────────────────────
  const handlePinPress = (digit: string) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      if (next.length === 4) {
        setPinSuccess(true);
        onShowToast('PIN Validado!', 'Autorização confirmada.', 'lock_open');
        setTimeout(() => { setPinInput(''); setPinSuccess(false); }, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col w-full pb-12 gap-6" id="view-dashboard-aprovacoes">
      {/* BANNER PRINCIPAL */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#081534] via-[#1e2a4a] to-[#003220] text-white p-6 sm:p-8 shadow-md border border-[#1e2a4a]">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#fea619]/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-[#6ffbbe]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fea619]/20 px-3 py-0.5 text-[11px] font-bold text-[#ffddb8] tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffddb8] animate-pulse" />
                AUDITORIA & CARTEIRAS
              </span>
              <span className="text-[#8691b7] text-xs font-medium">• Modo Administrativo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Central de Auditoria
            </h1>
            <p className="text-sm sm:text-base text-[#bac5ee] leading-relaxed">
              Supervisione o cumprimento das rotinas, audite tarefas pendentes e gerencie as recompensas da família.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            {/* Seletor de Data */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-lg text-white text-xs font-semibold hover:bg-white/20 transition-all border border-white/10"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ffddb8]">calendar_today</span>
                <span className="capitalize">{formatDateLabel(selectedDate)}</span>
                <span className="material-symbols-outlined text-[16px] opacity-70">expand_more</span>
              </button>

              {showDatePicker && (
                <div className="absolute top-full left-0 mt-1 bg-[#0f2040] border border-white/10 rounded-xl shadow-2xl p-3 z-50 min-w-[220px]">
                  <p className="text-[11px] text-[#bac5ee] mb-2">Selecionar data:</p>
                  <input
                    type="date"
                    value={selectedDate}
                    max={todayStr}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setShowDatePicker(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-xs font-semibold border border-white/10 outline-none focus:border-[#fea619]"
                  />
                  <button
                    onClick={() => { setSelectedDate(todayStr); setShowDatePicker(false); }}
                    className="mt-2 w-full py-1.5 text-[11px] font-bold text-[#fea619] hover:underline"
                  >
                    Voltar para hoje
                  </button>
                </div>
              )}
            </div>

            {/* Filtro por Filho — dinâmico */}
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-semibold hover:bg-white/20 transition-all border border-white/10">
              <span className="material-symbols-outlined text-[18px] text-[#4edea3]">family_restroom</span>
              <select
                value={selectedChildFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="bg-transparent border-0 text-white text-xs font-semibold focus:ring-0 outline-none pr-2 cursor-pointer"
              >
                <option className="text-[#191c1e] bg-white" value="all">Todos os Filhos</option>
                {childrenData.map((child) => (
                  <option key={child.id} className="text-[#191c1e] bg-white" value={child.id}>
                    {child.name} ({child.age})
                  </option>
                ))}
              </select>
            </div>

            {/* Aprovar em Lote */}
            <button
              onClick={onBatchApproveOnTime}
              disabled={onTimeCount === 0}
              className={`flex items-center gap-2 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-lg transition-all duration-200 active:scale-95 ${onTimeCount > 0 ? 'bg-[#fea619] hover:bg-[#ffb95f] text-[#2a1700] cursor-pointer' : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'}`}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              <span>{onTimeCount > 0 ? `Aprovar no Prazo (${onTimeCount})` : 'Sem Tarefas no Prazo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Pendências */}
        <div className="flex flex-col justify-between bg-surface-container-lowest rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden border border-outline-variant/30">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#fea619]" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Auditoria Pendente</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-on-surface">{pendingTasks.length}</span>
                <span className="text-sm font-medium text-on-surface-variant">tarefas</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[#fea619]/20 text-[#684000] dark:text-[#ffb95f]">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#00a673]">
              <span className="h-2 w-2 rounded-full bg-[#00a673]" />{onTimeCount} no prazo
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#855300] dark:text-[#ffb95f]">
              <span className="h-2 w-2 rounded-full bg-[#855300] dark:bg-[#ffb95f]" />{delayedCount} com atraso
            </span>
          </div>
        </div>

        {/* Cards de cada filho — dinâmico */}
        {childrenData.slice(0, 2).map((child, idx) => (
          <div key={child.id} className="flex flex-col justify-between bg-surface-container-lowest rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={child.avatar} alt={child.name} className="w-11 h-11 rounded-full object-cover shadow-xs ring-2 ring-outline-variant/30" />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00a673] text-white text-[9px] font-bold">{child.badgeNumber}</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-on-surface">{child.name} ({child.age.replace(' anos', 'a')})</div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#00a673]">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>{child.weekPercent}% na semana</span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed text-[11px] font-bold">{child.level}</span>
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-on-surface-variant font-medium">Saldo:</span>
                <div className="flex items-center gap-1 text-lg font-extrabold text-[#855300] dark:text-[#ffb95f]">
                  <span className="material-symbols-outlined text-[20px] text-[#fea619]" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
                  <span>{child.balance} pts</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
                <div className={`${idx === 0 ? 'bg-[#fea619]' : 'bg-[#00a673]'} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, Math.round((child.balance / 1000) * 100))}%` }} />
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant pt-0.5">
                <span>Acumulados: {child.accumulated}</span>
                <span>Gastos: {child.spent}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Incentivos Pendentes */}
        <div className="flex flex-col justify-between bg-surface-container-lowest rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Incentivos</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-on-surface">{pendingRewards.length}</span>
                <span className="text-sm font-medium text-on-surface-variant">aguardando</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-primary-fixed">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
            </div>
          </div>
          <div className="mt-3 pt-1 space-y-1">
            {pendingRewards.slice(0, 2).map((r) => (
              <div key={r.id} className="flex items-center gap-2 text-xs font-semibold text-on-surface truncate">
                <span className="material-symbols-outlined text-[16px] text-[#855300] dark:text-[#ffb95f]">{r.icon || 'star'}</span>
                <span className="truncate">{r.title} ({r.childName})</span>
              </div>
            ))}
            {pendingRewards.length === 0 && <div className="text-xs text-on-surface-variant/70 italic">Todos os resgates entregues.</div>}
          </div>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FILA DE AUDITORIA */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/30 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary text-white rounded-lg">
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">Fila de Aprovação de Rotinas</h2>
                <p className="text-xs text-on-surface-variant">Valide evidências e libere pontos.</p>
              </div>
            </div>

            <div className="flex items-center bg-surface-container-low p-1 rounded-lg self-start sm:self-auto">
              {(['pending', 'approved', 'rejected'] as TaskStatus[]).map((tab) => {
                const labels: Record<string, string> = { pending: 'Pendentes', approved: 'Aprovadas', rejected: 'Rejeitadas' };
                const counts: Record<string, number> = { pending: pendingTasks.length, approved: approvedTodayCount, rejected: rejectedCount };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === tab ? 'bg-surface-container-lowest shadow-xs text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    <span>{labels[tab]}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === 'pending' ? 'bg-[#fea619] text-[#2a1700]' : 'bg-surface-container-high text-on-surface'}`}>{counts[tab]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-10 text-center border border-outline-variant/30 shadow-xs flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">
                {activeTab === 'pending' ? 'Nenhuma tarefa pendente' : activeTab === 'approved' ? 'Nenhuma tarefa aprovada' : 'Nenhuma tarefa rejeitada'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                {activeTab === 'pending' ? 'Todas as rotinas foram auditadas com sucesso.' : 'O histórico aparecerá aqui quando as rotinas forem validadas.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isPenaltyActive = penaltyToggles[task.id] ?? task.hasPenalty;
              const pointsToAward = isPenaltyActive ? task.basePoints - task.penaltyAmount : task.basePoints;
              const categoryColors: Record<string, string> = {
                'Organização': 'bg-blue-50 text-blue-800 border-blue-200',
                'Estudos': 'bg-amber-50 text-amber-900 border-amber-200',
                'Higiene': 'bg-emerald-50 text-emerald-900 border-emerald-200',
              };
              const catClass = categoryColors[task.category] || 'bg-purple-50 text-purple-900 border-purple-200';

              return (
                <div key={task.id} className="flex flex-col bg-surface-container-lowest rounded-xl p-5 shadow-xs hover:shadow-md transition-all gap-4 border border-outline-variant/30">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img src={task.avatar} alt={task.childName} className="w-10 h-10 rounded-full object-cover shadow-2xs ring-1 ring-outline-variant/30 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-sm sm:text-base text-on-surface">{task.title}</span>
                          <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">{task.code}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${catClass}`}>{task.category}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant flex-wrap">
                          <span>Responsável: <strong className="text-on-surface">{task.childName}</strong></span>
                          <span>•</span>
                          {task.onTime ? (
                            <span className="flex items-center gap-1 text-[#00a673] font-semibold">
                              <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              <span>{task.timingLabel}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[#855300] dark:text-[#ffb95f] font-semibold">
                              <span className="material-symbols-outlined text-[16px]">schedule</span>
                              <span>{task.timingLabel}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-sm ${task.onTime ? 'bg-[#6ffbbe]/30 text-[#003220] dark:bg-emerald-950 dark:text-emerald-300' : 'bg-[#ffddb8] text-[#2a1700] dark:bg-amber-950 dark:text-amber-200'}`}>
                        <span className={`material-symbols-outlined text-[16px] ${task.onTime ? 'text-[#00a673]' : 'text-[#855300] dark:text-[#ffb95f]'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{task.onTime ? 'add_circle' : 'toll'}</span>
                        <span>+{pointsToAward} pts</span>
                      </div>
                      {onEditTask && (
                        <button type="button" onClick={() => onEditTask(task)} className="p-1 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}
                      {onDeleteTask && (
                        <button type="button" onClick={() => { if (confirm(`Excluir "${task.title}"?`)) onDeleteTask(task.id); }} className="p-1 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer" title="Excluir">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-surface-container-low p-3.5 rounded-lg text-xs">
                    <div className="md:col-span-2 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">rule</span>
                        <span>Critérios de aceite:</span>
                      </span>
                      <p className="text-on-surface text-xs sm:text-sm italic font-medium leading-relaxed">&ldquo;{task.criteria}&rdquo;</p>
                    </div>
                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-outline-variant/20 md:pl-3 pt-2 md:pt-0">
                      <div className="flex justify-between text-xs"><span className="text-on-surface-variant">Horário limite:</span><span className="font-semibold text-on-surface">{task.limitTime}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-on-surface-variant">Realizado às:</span><span className={`font-semibold ${task.onTime ? 'text-[#00a673]' : 'text-[#855300] dark:text-[#ffb95f]'}`}>{task.completedAt || '—'}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-on-surface-variant">Duração:</span><span className="font-semibold text-on-surface">{task.duration}</span></div>
                    </div>
                  </div>

                  {!task.onTime && task.penaltyAmount > 0 && activeTab === 'pending' && (
                    <div className="flex items-center justify-between bg-surface-container-low px-3.5 py-2 rounded-lg border border-outline-variant/30">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input type="checkbox" checked={isPenaltyActive} onChange={(e) => setPenaltyToggles({ ...penaltyToggles, [task.id]: e.target.checked })} className="w-4 h-4 rounded text-[#fea619] focus:ring-0 cursor-pointer accent-[#fea619]" />
                        <span className="text-xs sm:text-sm font-semibold text-on-surface">Aplicar penalidade de atraso (-{task.penaltyAmount} pts)</span>
                      </label>
                      <span className="text-[11px] font-bold text-[#653e00] dark:text-[#ffddb8] bg-[#ffddb8]/80 dark:bg-amber-950/80 px-2 py-0.5 rounded">Tolerância excedida</span>
                    </div>
                  )}

                  {activeTab === 'pending' ? (
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={feedbackValues[task.id] || ''}
                          onChange={(e) => setFeedbackValues({ ...feedbackValues, [task.id]: e.target.value })}
                          placeholder="Adicionar orientação pedagógica..."
                          className="w-full h-10 px-3.5 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30"
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => onRequestPhoto(task)} className="px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                          <span className="hidden sm:inline">Pedir Foto</span>
                        </button>
                        <button onClick={() => onRejectTask(task.id, feedbackValues[task.id])} className="px-3 py-2 rounded-lg bg-[#ffdad6] hover:bg-red-200 text-[#93000a] dark:bg-red-950 dark:text-red-300 font-semibold text-xs flex items-center gap-1 transition-colors active:scale-95 cursor-pointer">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                          <span>Rejeitar</span>
                        </button>
                        <button onClick={() => onApproveTask(task.id, feedbackValues[task.id], pointsToAward)} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer">
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                          <span>Aprovar (+{pointsToAward} pts)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                      <span className="text-on-surface-variant italic">{task.feedback || 'Sem observações registradas'}</span>
                      <span className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${task.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'}`}>
                        {task.status === 'approved' ? `Aprovada (+${task.points} pts)` : 'Rejeitada'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* COLUNA DIREITA */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Central de Entrega */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-outline-variant/30 flex flex-col gap-4 text-on-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#855300] dark:text-[#ffb95f] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                <h3 className="text-base font-bold text-on-surface">Resgates de Incentivos</h3>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Itens solicitados pelos filhos que aguardam entrega pelos responsáveis.
            </p>
            <div className="space-y-3">
              {rewards.map((reward) => {
                const isPending = reward.status === 'pending';
                return (
                  <div key={reward.id} className={`p-3.5 rounded-xl flex flex-col gap-2 transition-all ${isPending ? 'bg-surface-container-low border-l-4 border-[#fea619]' : 'bg-surface-container-low/60 opacity-80'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-on-surface">{reward.title}</div>
                        <div className="text-xs text-on-surface-variant">{reward.childName} • {reward.cost} pts</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPending ? 'bg-[#ffddb8] text-[#2a1700] dark:bg-amber-950 dark:text-amber-200' : 'bg-[#6ffbbe]/50 text-[#002113] dark:bg-emerald-950 dark:text-emerald-300'}`}>
                        {isPending ? 'Pendente' : 'Entregue'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                      <span className="text-[11px] text-on-surface-variant/70">{reward.requestedAt || reward.deliveredAt || '—'}</span>
                      {isPending ? (
                        <button onClick={() => onDeliverReward(reward.id)} className="px-2.5 py-1 rounded-lg bg-[#fea619] hover:bg-[#ffb95f] text-[#2a1700] font-bold text-xs flex items-center gap-1 shadow-2xs transition-transform active:scale-95 cursor-pointer">
                          <span className="material-symbols-outlined text-[15px]">check</span>
                          <span>Entregar</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          <span>Entregue</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PIN de Segurança */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-outline-variant/30 flex flex-col gap-4 text-on-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface">PIN de Validação Rápida</h4>
                  <span className="text-[11px] text-on-surface-variant">Uso em tablets compartilhados</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#00a673] text-[20px]">shield</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Digite seu PIN de 4 dígitos para confirmar liberações importantes.
            </p>
            <div className="flex justify-center items-center gap-3 py-1">
              {[1, 2, 3, 4].map((i) => {
                const filled = i <= pinInput.length;
                return (
                  <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${filled ? (pinSuccess ? 'bg-emerald-500 scale-125 ring-2 ring-emerald-200' : 'bg-[#fea619] shadow-xs scale-110') : 'bg-surface-container-high'}`} />
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['1','2','3','4','5','6','7','8','9'].map((d) => (
                <button key={d} onClick={() => handlePinPress(d)} className="h-11 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-base font-bold text-on-surface flex items-center justify-center transition-colors active:scale-95 cursor-pointer">{d}</button>
              ))}
              <button onClick={() => setPinInput('')} className="h-11 rounded-lg bg-surface-container-high hover:bg-surface-container text-xs font-bold text-on-surface-variant flex items-center justify-center transition-colors active:scale-95 cursor-pointer">Limpar</button>
              <button onClick={() => handlePinPress('0')} className="h-11 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-base font-bold text-on-surface flex items-center justify-center transition-colors active:scale-95 cursor-pointer">0</button>
              <button onClick={() => setPinInput((p) => p.slice(0, -1))} className="h-11 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors active:scale-95 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">backspace</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
              <span>PIN do responsável configurado</span>
              <button onClick={onOpenPinChangeModal} className="text-primary hover:underline font-bold cursor-pointer">Alterar Código</button>
            </div>
          </div>

          {/* Ritmo Semanal */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-outline-variant/30 flex flex-col gap-3 text-on-surface">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-on-surface">Ritmo da Família</span>
              <span className="text-[11px] text-[#00a673] font-bold">+14% vs semana passada</span>
            </div>
            <div className="flex items-center gap-4 pt-1">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                  <path className="text-[#00a673]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="94, 100" strokeLinecap="round" strokeWidth="3.5" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-extrabold text-on-surface">94%</span>
                  <span className="text-[8px] text-on-surface-variant font-bold uppercase">Sucesso</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-on-surface">32 rotinas concluídas</div>
                <div className="text-xs text-on-surface-variant leading-relaxed">Apenas 2 atrasos tolerados nos últimos 7 dias.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
