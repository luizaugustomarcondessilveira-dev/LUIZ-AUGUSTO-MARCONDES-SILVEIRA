'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AuditDashboard from '@/components/AuditDashboard';
import ActivitiesCatalog from '@/components/ActivitiesCatalog';
import WalletStatement from '@/components/WalletStatement';
import RewardsShop from '@/components/RewardsShop';
import FamilyMembers from '@/components/FamilyMembers';
import SettingsView from '@/components/SettingsView';

import NewActivityModal from '@/components/NewActivityModal';
import ProofPhotoModal from '@/components/ProofPhotoModal';
import ChildModeModal from '@/components/ChildModeModal';
import PinSecurityModal from '@/components/PinSecurityModal';

import {
  INITIAL_CHILDREN,
  INITIAL_TASKS,
  INITIAL_REWARDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRANSACTIONS,
} from '@/lib/initial-data';
import {
  Child,
  RoutineTask,
  RewardItem,
  NotificationItem,
  PointTransaction,
} from '@/lib/types';
import {
  isSupabaseConfigured,
  syncFetchAll,
  syncUpsertTask,
  syncInsertNotification,
  syncUpdateChildBalance,
} from '@/lib/supabase';

export default function RotinasDaFamiliaApp() {
  // Primary State
  const [childrenData, setChildrenData] = useState<Child[]>(INITIAL_CHILDREN);
  const [tasks, setTasks] = useState<RoutineTask[]>(INITIAL_TASKS);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [transactions, setTransactions] = useState<PointTransaction[]>(INITIAL_TRANSACTIONS);

  // App Navigation & Filters
  const [currentView, setCurrentView] = useState<string>('dashboard-aprovacoes');
  const [selectedChildFilter, setSelectedChildFilter] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('Família Silva');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Security PIN
  const [pinCode, setPinCode] = useState<string>('1234');
  const [isPinLocked, setIsPinLocked] = useState<boolean>(false);
  const [pinModalState, setPinModalState] = useState<{
    isOpen: boolean;
    mode: 'unlock' | 'change';
  }>({ isOpen: false, mode: 'unlock' });

  // Theme Mode (light / dark / system) using globals.css variables
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('rotinas_theme') as 'light' | 'dark' | 'system';
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          return savedTheme;
        }
      } catch {
        // ignore
      }
    }
    return 'light';
  });

  const applyTheme = (mode: 'light' | 'dark' | 'system') => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const isDark =
      mode === 'dark' ||
      (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  };

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (themeMode !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      applyTheme('system');
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeMode(newTheme);
    try {
      localStorage.setItem('rotinas_theme', newTheme);
    } catch {
      // ignore
    }
    showToast(
      'Tema Atualizado',
      newTheme === 'dark'
        ? 'Modo escuro ativado com as variáveis do globals.css.'
        : newTheme === 'light'
        ? 'Modo claro ativado com sucesso.'
        : 'Tema configurado para acompanhar o dispositivo.',
      newTheme === 'dark' ? 'dark_mode' : 'light_mode'
    );
  };

  // Modals
  const [isNewActivityOpen, setIsNewActivityOpen] = useState<boolean>(false);
  const [proofPhotoTask, setProofPhotoTask] = useState<RoutineTask | null>(null);
  const [childModeState, setChildModeState] = useState<{
    isOpen: boolean;
    childId: string;
  }>({ isOpen: false, childId: 'lucas' });

  // Toast Notification
  const [toast, setToast] = useState<{
    visible: boolean;
    title: string;
    desc: string;
    icon: string;
  }>({
    visible: false,
    title: '',
    desc: '',
    icon: 'check_circle',
  });

  const showToast = (title: string, desc: string, icon = 'check_circle') => {
    setToast({ visible: true, title, desc, icon });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Synchronize with Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    syncFetchAll().then((remoteData) => {
      if (!isMounted || !remoteData) return;
      if (remoteData.children && remoteData.children.length > 0) {
        setChildrenData(remoteData.children);
      }
      if (remoteData.tasks && remoteData.tasks.length > 0) {
        setTasks(remoteData.tasks);
      }
      if (remoteData.rewards && remoteData.rewards.length > 0) {
        setRewards(remoteData.rewards);
      }
      if (remoteData.notifications && remoteData.notifications.length > 0) {
        setNotifications(remoteData.notifications);
      }
      if (remoteData.transactions && remoteData.transactions.length > 0) {
        setTransactions(remoteData.transactions);
      }
      showToast(
        'Supabase Sincronizado',
        'Dados carregados do banco PostgreSQL Supabase com sucesso.',
        'cloud_done'
      );
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle approving a single task
  const handleApproveTask = (taskId: string, customFeedback?: string, customPoints?: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const pointsAwarded = customPoints !== undefined ? customPoints : task.points;

    const updatedTask = {
      ...task,
      status: 'approved' as const,
      points: pointsAwarded,
      feedback: customFeedback || task.feedback,
    };

    // Update task
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? updatedTask : t
      )
    );

    // Sync to Supabase
    syncUpsertTask(updatedTask);

    // Update child balance
    setChildrenData((prev) =>
      prev.map((c) => {
        if (c.id === task.childId) {
          const newBal = c.balance + pointsAwarded;
          const newAcc = c.accumulated + pointsAwarded;
          syncUpdateChildBalance(c.id, newBal, newAcc, c.spent);
          return {
            ...c,
            balance: newBal,
            accumulated: newAcc,
          };
        }
        return c;
      })
    );

    // Add transaction
    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      childId: task.childId,
      childName: task.childName,
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: task.title,
      type: 'earned',
      points: pointsAwarded,
      category: task.category,
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Atividade Aprovada!',
      `+${pointsAwarded} pontos creditados na carteira de ${task.childName}.`,
      'verified'
    );
  };

  // Handle rejecting a single task
  const handleRejectTask = (taskId: string, reason?: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask = {
      ...task,
      status: 'rejected' as const,
      feedback: reason || 'Necessário revisar a rotina.',
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? updatedTask : t
      )
    );

    syncUpsertTask(updatedTask);

    showToast(
      'Atividade Rejeitada',
      `Orientação pedagógica registrada para ${task.childName}.`,
      'cancel'
    );
  };

  // Handle batch approving all on-time tasks
  const handleBatchApproveOnTime = () => {
    const onTimeTasks = tasks.filter((t) => t.status === 'pending' && t.onTime);
    if (onTimeTasks.length === 0) return;

    let totalPoints = 0;
    const pointsByChild: Record<string, number> = {};

    onTimeTasks.forEach((t) => {
      totalPoints += t.points;
      pointsByChild[t.childId] = (pointsByChild[t.childId] || 0) + t.points;
    });

    // Mark all as approved
    setTasks((prev) =>
      prev.map((t) =>
        t.status === 'pending' && t.onTime
          ? { ...t, status: 'approved', feedback: 'Aprovado em lote pela Central dos Pais.' }
          : t
      )
    );

    // Update balances
    setChildrenData((prev) =>
      prev.map((c) => {
        const added = pointsByChild[c.id] || 0;
        return {
          ...c,
          balance: c.balance + added,
          accumulated: c.accumulated + added,
        };
      })
    );

    // Add batch transaction
    const newTx: PointTransaction = {
      id: `tx-batch-${Date.now()}`,
      childId: 'batch',
      childName: 'Família Silva',
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Aprovação em lote (${onTimeTasks.length} rotinas no prazo)`,
      type: 'earned',
      points: totalPoints,
      category: 'Geral',
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Lote Processado!',
      `${onTimeTasks.length} tarefas no prazo foram aprovadas (+${totalPoints} pts distribuídos).`,
      'done_all'
    );
  };

  // Handle delivering a reward
  const handleDeliverReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;

    setRewards((prev) =>
      prev.map((r) =>
        r.id === rewardId
          ? {
              ...r,
              status: 'delivered',
              deliveredAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : r
      )
    );

    showToast(
      'Recompensa Entregue!',
      `"${reward.title}" autorizada e entregue para ${reward.childName}.`,
      'celebration'
    );
  };

  // Handle adding a new task from modal
  const handleAddTask = (newTask: RoutineTask) => {
    setTasks((prev) => [newTask, ...prev]);

    // Add unread notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Nova tarefa: ${newTask.title}`,
      message: `Atribuída a ${newTask.childName} (+${newTask.points} pts).`,
      time: 'Agora',
      unread: true,
      type: 'routine',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Sync to Supabase
    syncUpsertTask(newTask);
    syncInsertNotification(newNotif);

    showToast('Atividade Cadastrada', 'Disponível no catálogo e na rotina da família.', 'add_task');
  };

  // Child mode completions & redemptions
  const handleCompleteTaskByChild = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const completedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const child = childrenData.find((c) => c.id === task.childId) || { name: task.childName };

    const updatedTask = {
      ...task,
      status: 'pending' as const,
      completedAt: completedTime,
      timingLabel: `Enviada às ${completedTime} (Aguardando auditoria)`,
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? updatedTask : t
      )
    );

    // Gerar notificação para os pais auditarem
    const newNotif: NotificationItem = {
      id: `notif-audit-${Date.now()}`,
      title: `Auditoria Pendente: ${task.title}`,
      message: `${child.name} confirmou a realização da rotina (${completedTime}). Acesse a auditoria para avaliar o cumprimento e liberar ${task.points} pontos.`,
      time: 'Agora',
      unread: true,
      type: 'routine',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Sync to Supabase
    syncUpsertTask(updatedTask);
    syncInsertNotification(newNotif);

    showToast(
      'Tarefa Confirmada!',
      `${child.name} confirmou a tarefa. Notificação enviada para os pais auditarem.`,
      'fact_check'
    );
  };

  const handleRequestRewardByChild = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;

    const child = childrenData.find((c) => c.id === reward.childId);
    if (!child || child.balance < reward.cost) {
      showToast('Pontos insuficientes', 'Continue fazendo suas tarefas para juntar mais pontos.', 'warning');
      return;
    }

    // Deduct points
    setChildrenData((prev) =>
      prev.map((c) =>
        c.id === child.id
          ? {
              ...c,
              balance: c.balance - reward.cost,
              spent: c.spent + reward.cost,
            }
          : c
      )
    );

    // Update reward status to pending parent delivery
    setRewards((prev) =>
      prev.map((r) =>
        r.id === rewardId
          ? {
              ...r,
              status: 'pending',
              requestedAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : r
      )
    );

    // Add spending transaction
    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      childId: child.id,
      childName: child.name,
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Resgate: ${reward.title}`,
      type: 'spent',
      points: reward.cost,
      category: 'Recompensa',
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Resgate Solicitado com Sucesso!',
      `Aguarde a entrega ou liberação pelo Pai Admin.`,
      'card_giftcard'
    );
  };

  // Add manual points bonus
  const handleAddManualAdjustment = (childId: string, pts: number, reason: string) => {
    const child = childrenData.find((c) => c.id === childId);
    if (!child) return;

    setChildrenData((prev) =>
      prev.map((c) =>
        c.id === childId
          ? {
              ...c,
              balance: Math.max(0, c.balance + pts),
              accumulated: pts > 0 ? c.accumulated + pts : c.accumulated,
              spent: pts < 0 ? c.spent + Math.abs(pts) : c.spent,
            }
          : c
      )
    );

    const newTx: PointTransaction = {
      id: `tx-adj-${Date.now()}`,
      childId,
      childName: child.name,
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: reason,
      type: pts >= 0 ? 'earned' : 'penalty',
      points: Math.abs(pts),
      category: 'Ajuste Parental',
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Ajuste Concluído',
      `${pts >= 0 ? '+' : ''}${pts} pts para ${child.name}.`,
      pts >= 0 ? 'monetization_on' : 'warning'
    );
  };

  const handleResetData = () => {
    setChildrenData(INITIAL_CHILDREN);
    setTasks(INITIAL_TASKS);
    setRewards(INITIAL_REWARDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTransactions(INITIAL_TRANSACTIONS);
  };

  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;
  const pendingTasksCount = tasks.filter((t) => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased selection:bg-amber-200 transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isPinLocked={isPinLocked}
        onTogglePinLock={() => {
          if (isPinLocked) {
            setPinModalState({ isOpen: true, mode: 'unlock' });
          } else {
            setIsPinLocked(true);
            showToast('Painel Bloqueado', 'Use seu PIN para reabrir.', 'lock');
          }
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        pendingCount={pendingTasksCount}
      />

      {/* Main Container */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Header Bar */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewActivity={() => setIsNewActivityOpen(true)}
          onOpenChildMode={(childId) =>
            setChildModeState({ isOpen: true, childId: childId || 'lucas' })
          }
          notifications={notifications}
          onMarkNotificationRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
            )
          }
          selectedFamily={selectedFamily}
          onChangeFamily={setSelectedFamily}
          unreadCount={unreadNotificationsCount}
          themeMode={themeMode}
          onThemeChange={handleThemeChange}
          onSelectView={(view) => setCurrentView(view)}
        />

        {/* Dynamic Workspace Content */}
        <main className="w-full pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1">
          {isPinLocked ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#081534] text-white flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Sessão dos Pais Bloqueada</h2>
              <p className="text-xs text-slate-500">
                O painel administrativo está protegido contra toques acidentais pelas crianças.
              </p>
              <button
                onClick={() => setPinModalState({ isOpen: true, mode: 'unlock' })}
                className="w-full py-3 rounded-xl bg-[#fea619] hover:bg-[#ffb95f] text-[#2a1700] font-bold text-sm shadow-sm transition-all active:scale-95"
              >
                Digitar PIN para Desbloquear
              </button>
            </div>
          ) : (
            <>
              {currentView === 'dashboard-aprovacoes' && (
                <AuditDashboard
                  childrenData={childrenData}
                  tasks={tasks}
                  rewards={rewards}
                  selectedChildFilter={selectedChildFilter}
                  onFilterChange={setSelectedChildFilter}
                  onApproveTask={handleApproveTask}
                  onRejectTask={handleRejectTask}
                  onBatchApproveOnTime={handleBatchApproveOnTime}
                  onDeliverReward={handleDeliverReward}
                  onRequestPhoto={(task) => setProofPhotoTask(task)}
                  onShowToast={showToast}
                  onOpenPinChangeModal={() =>
                    setPinModalState({ isOpen: true, mode: 'change' })
                  }
                />
              )}

              {currentView === 'catalogo-de-atividades' && (
                <ActivitiesCatalog
                  tasks={tasks}
                  onOpenNewActivity={() => setIsNewActivityOpen(true)}
                  selectedChildFilter={selectedChildFilter}
                  onFilterChild={setSelectedChildFilter}
                />
              )}

              {currentView === 'carteira-extrato' && (
                <WalletStatement
                  childrenData={childrenData}
                  transactions={transactions}
                  onAddManualAdjustment={handleAddManualAdjustment}
                />
              )}

              {currentView === 'loja-de-recompensas' && (
                <RewardsShop
                  rewards={rewards}
                  childrenData={childrenData}
                  onDeliverReward={handleDeliverReward}
                  onAddNewReward={(reward) => {
                    const newR: RewardItem = {
                      ...reward,
                      id: `reward-${Date.now()}`,
                    };
                    setRewards((prev) => [newR, ...prev]);
                    showToast('Recompensa Criada', 'Disponível na loja familiar.', 'card_giftcard');
                  }}
                />
              )}

              {currentView === 'membros-da-familia' && (
                <FamilyMembers
                  childrenData={childrenData}
                  onOpenChildMode={(childId) =>
                    setChildModeState({ isOpen: true, childId })
                  }
                />
              )}

              {currentView === 'configuracoes' && (
                <SettingsView
                  currentPin={pinCode}
                  onUpdatePin={(newPin) => setPinCode(newPin)}
                  onResetData={handleResetData}
                  onShowToast={showToast}
                  themeMode={themeMode}
                  onThemeChange={handleThemeChange}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      <NewActivityModal
        isOpen={isNewActivityOpen}
        onClose={() => setIsNewActivityOpen(false)}
        childrenData={childrenData}
        onAddTask={handleAddTask}
      />

      <ProofPhotoModal
        isOpen={Boolean(proofPhotoTask)}
        task={proofPhotoTask}
        onClose={() => setProofPhotoTask(null)}
        onRequestNewPhoto={(taskId) => {
          showToast(
            'Pedido de Foto Enviado!',
            'Notificação push emitida para o tablet da criança.',
            'photo_camera'
          );
        }}
        onDirectApprove={(taskId) => {
          handleApproveTask(taskId);
        }}
      />

      <ChildModeModal
        isOpen={childModeState.isOpen}
        onClose={() => setChildModeState({ isOpen: false, childId: 'lucas' })}
        activeChildId={childModeState.childId}
        childrenData={childrenData}
        tasks={tasks}
        rewards={rewards}
        onCompleteTaskByChild={handleCompleteTaskByChild}
        onRequestRewardByChild={handleRequestRewardByChild}
      />

      <PinSecurityModal
        isOpen={pinModalState.isOpen}
        onClose={() => setPinModalState({ isOpen: false, mode: 'unlock' })}
        correctPin={pinCode}
        mode={pinModalState.mode}
        onSuccessUnlock={() => {
          setIsPinLocked(false);
          showToast('Painel Desbloqueado!', 'Acesso administrativo concedido.', 'lock_open');
        }}
        onUpdatePin={(newPin) => {
          setPinCode(newPin);
          showToast('Novo PIN Salvo!', 'O código foi atualizado.', 'verified');
        }}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      <div
        id="toast-feedback"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#081534] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/50 transition-all duration-300 pointer-events-auto ${
          toast.visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-16 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <span
          className="material-symbols-outlined text-[#fea619] text-[24px]"
          id="toast-icon"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {toast.icon}
        </span>
        <div>
          <div className="font-bold text-sm leading-tight text-white" id="toast-title">
            {toast.title}
          </div>
          <div className="text-xs text-[#bac5ee] mt-0.5" id="toast-desc">
            {toast.desc}
          </div>
        </div>
      </div>
    </div>
  );
}
