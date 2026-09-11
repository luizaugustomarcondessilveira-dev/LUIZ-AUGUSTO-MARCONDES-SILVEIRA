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
import LoginScreen from '@/components/LoginScreen';

import NewActivityModal from '@/components/NewActivityModal';
import ProofPhotoModal from '@/components/ProofPhotoModal';
import ChildModeModal from '@/components/ChildModeModal';
import PinSecurityModal from '@/components/PinSecurityModal';
import AuthModal from '@/components/AuthModal';
import EditActivityModal from '@/components/EditActivityModal';
import EditRewardModal from '@/components/EditRewardModal';
import ManageCategoriesModal from '@/components/ManageCategoriesModal';
import EditFamilyNameModal from '@/components/EditFamilyNameModal';

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
  ParentProfile,
  FamilyAuthUser,
} from '@/lib/types';
import {
  isSupabaseConfigured,
  syncFetchAll,
  syncUpsertTask,
  syncDeleteTask,
  syncUpsertReward,
  syncDeleteReward,
  syncUpsertFamilyMember,
  syncDeleteFamilyMember,
  syncSaveFamilyProfile,
  syncInsertNotification,
  syncUpdateChildBalance,
  syncUpdateFamilyMemberName,
  getSupabaseSessionUser,
  signOutSupabase,
  subscribeToSupabaseRealtime,
} from '@/lib/supabase';

export default function RotinasDaFamiliaApp() {
  // ─── Tela de Login ───────────────────────────────────────────────────────────
  const [loginDone, setLoginDone] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rotinas_login_done') === 'true';
    }
    return false;
  });
  const [loginRole, setLoginRole] = useState<'parent' | 'child' | null>(null);
  const [loginChildId, setLoginChildId] = useState<string | null>(null);

  // ─── Dados Primários ─────────────────────────────────────────────────────────
  const [childrenData, setChildrenData] = useState<Child[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rotinas_children');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch { /* ignore */ }
    }
    return INITIAL_CHILDREN;
  });

  const [tasks, setTasks] = useState<RoutineTask[]>(INITIAL_TASKS);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [transactions, setTransactions] = useState<PointTransaction[]>(INITIAL_TRANSACTIONS);

  // ─── Navegação ───────────────────────────────────────────────────────────────
  const [currentView, setCurrentView] = useState<string>('dashboard-aprovacoes');
  const [selectedChildFilter, setSelectedChildFilter] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('Família Silva');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // ─── Perfil dos Pais ─────────────────────────────────────────────────────────
  const [parentProfile, setParentProfile] = useState<ParentProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rotinas_parent_profile');
        if (saved) return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return {
      fatherName: 'Pai Admin',
      motherName: 'Mãe Admin',
      familyName: 'Família Silva',
      email: 'luizaugustomarcondessilveira@gmail.com',
      role: 'Administrador Chefe',
    };
  });

  // ─── Usuário Autenticado ─────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<FamilyAuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rotinas_auth_user');
        if (saved) return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // ─── PIN de Segurança ────────────────────────────────────────────────────────
  const [pinCode, setPinCode] = useState<string>('1234');
  const [isPinLocked, setIsPinLocked] = useState<boolean>(false);
  const [pinModalState, setPinModalState] = useState<{ isOpen: boolean; mode: 'unlock' | 'change' }>({
    isOpen: false,
    mode: 'unlock',
  });

  // ─── Tema ────────────────────────────────────────────────────────────────────
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('rotinas_theme') as 'light' | 'dark' | 'system';
        if (['light', 'dark', 'system'].includes(savedTheme)) return savedTheme;
      } catch { /* ignore */ }
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

  useEffect(() => { applyTheme(themeMode); }, [themeMode]);

  useEffect(() => {
    if (themeMode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeMode]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeMode(newTheme);
    try { localStorage.setItem('rotinas_theme', newTheme); } catch { /* ignore */ }
    showToast(
      'Tema Atualizado',
      newTheme === 'dark'
        ? 'Modo escuro ativado.'
        : newTheme === 'light'
        ? 'Modo claro ativado.'
        : 'Tema automático ativado.',
      newTheme === 'dark' ? 'dark_mode' : 'light_mode'
    );
  };

  // ─── Modais ──────────────────────────────────────────────────────────────────
  const [isNewActivityOpen, setIsNewActivityOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState<boolean>(false);
  const [editingReward, setEditingReward] = useState<RewardItem | null>(null);
  const [isEditRewardOpen, setIsEditRewardOpen] = useState<boolean>(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState<boolean>(false);
  const [isEditFamilyNameOpen, setIsEditFamilyNameOpen] = useState<boolean>(false);
  const [proofPhotoTask, setProofPhotoTask] = useState<RoutineTask | null>(null);
  const [childModeState, setChildModeState] = useState<{ isOpen: boolean; childId: string }>({
    isOpen: false,
    childId: 'lucas',
  });

  // ─── Categorias ──────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rotinas_categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch { /* ignore */ }
    }
    return ['Organização', 'Estudos', 'Higiene', 'Convivência', 'Saúde'];
  });

  // ─── Toast ───────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ visible: boolean; title: string; desc: string; icon: string }>({
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
      const timer = setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3800);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // ─── Supabase: Carga Inicial ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let mounted = true;
    syncFetchAll().then((remoteData) => {
      if (!mounted || !remoteData) return;
      if (remoteData.children && remoteData.children.length > 0) setChildrenData(remoteData.children);
      if (remoteData.tasks && remoteData.tasks.length > 0) setTasks(remoteData.tasks);
      if (remoteData.rewards && remoteData.rewards.length > 0) setRewards(remoteData.rewards);
      if (remoteData.notifications && remoteData.notifications.length > 0) setNotifications(remoteData.notifications);
      if (remoteData.transactions && remoteData.transactions.length > 0) setTransactions(remoteData.transactions);
      showToast('Supabase Sincronizado', 'Dados carregados com sucesso.', 'cloud_done');
    });
    return () => { mounted = false; };
  }, []);

  // ─── Supabase: Tempo Real ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const unsub = subscribeToSupabaseRealtime(() => {
      syncFetchAll().then((remoteData) => {
        if (!remoteData) return;
        if (remoteData.children && remoteData.children.length > 0)
        if (remoteData.tasks && remoteData.tasks.length > 0) setTasks(remoteData.tasks);
        if (remoteData.rewards && remoteData.rewards.length > 0) setRewards(remoteData.rewards);
        if (remoteData.notifications && remoteData.notifications.length > 0) setNotifications(remoteData.notifications);
        if (remoteData.transactions && remoteData.transactions.length > 0) setTransactions(remoteData.transactions);
      });
    });
    return () => unsub();
  }, []);

  // ─── Supabase: Sessão ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getSupabaseSessionUser().then((user) => {
      if (user) {
        const meta = user.user_metadata || {};
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          name: meta.name || user.email?.split('@')[0] || 'Membro',
          role: meta.role || 'parent',
          childId: meta.childId,
          isDemo: false,
        });
      }
    });
  }, []);

  // ─── Login ───────────────────────────────────────────────────────────────────
  const handleLogin = (role: 'parent' | 'child', childId?: string) => {
    setLoginDone(true);
    setLoginRole(role);
    if (childId) {
      setLoginChildId(childId);
      setSelectedChildFilter(childId);
      setChildModeState({ isOpen: true, childId });
    }
    try { localStorage.setItem('rotinas_login_done', 'true'); } catch { /* ignore */ }
    showToast(
      role === 'parent' ? 'Bem-vindo, Responsável!' : 'Olá! Modo filho ativado.',
      role === 'parent' ? 'Acesso administrativo concedido.' : 'Suas rotinas estão prontas.',
      role === 'parent' ? 'shield_person' : 'child_care'
    );
  };

  const handleLogoutToLogin = () => {
    setLoginDone(false);
    setLoginRole(null);
    setLoginChildId(null);
    try { localStorage.removeItem('rotinas_login_done'); } catch { /* ignore */ }
  };

  // ─── Perfil Familiar ─────────────────────────────────────────────────────────
  const handleUpdateParentProfile = (newProfile: ParentProfile) => {
    setParentProfile(newProfile);
    if (newProfile.familyName) setSelectedFamily(newProfile.familyName);
    try { localStorage.setItem('rotinas_parent_profile', JSON.stringify(newProfile)); } catch { /* ignore */ }
    if (isSupabaseConfigured) syncSaveFamilyProfile(newProfile);
  };

  const handleSaveFamilyName = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const updated = { ...parentProfile, familyName: trimmed };
    setParentProfile(updated);
    setSelectedFamily(trimmed);
    try { localStorage.setItem('rotinas_parent_profile', JSON.stringify(updated)); } catch { /* ignore */ }
    if (isSupabaseConfigured) syncSaveFamilyProfile(updated);
    showToast('Nome da Família Atualizado', `Grupo alterado para "${trimmed}".`, 'home');
  };

  // ─── Membros ─────────────────────────────────────────────────────────────────
  const handleSaveMember = (memberData: any) => {
    if (memberData.role === 'parent') {
      const isFather = memberData.id === 'pai' || memberData.id === 'father';
      const updated: ParentProfile = {
        ...parentProfile,
        fatherName: isFather ? memberData.name : parentProfile.fatherName,
        motherName: !isFather ? memberData.name : parentProfile.motherName,
        ...(isFather ? { fatherAvatar: memberData.avatar } : { motherAvatar: memberData.avatar }),
        email: memberData.email || parentProfile.email,
      };
      setParentProfile(updated);
      try { localStorage.setItem('rotinas_parent_profile', JSON.stringify(updated)); } catch {}
      if (isSupabaseConfigured) syncSaveFamilyProfile(updated);
      showToast('Perfil Salvo', `Dados de ${memberData.name} atualizados.`, 'verified_user');
      return;
    }

    const existingIdx = childrenData.findIndex((c) => c.id === memberData.id);
    let updatedChildren: Child[];
    if (existingIdx >= 0) {
      updatedChildren = childrenData.map((c) =>
        c.id === memberData.id
          ? { ...c, name: memberData.name, avatar: memberData.avatar || c.avatar, age: memberData.age || c.age, level: memberData.level || c.level, balance: memberData.balance !== undefined ? memberData.balance : c.balance }
          : c
      );
    } else {
      const newChild: Child = {
        id: memberData.id,
        name: memberData.name,
        avatar: memberData.avatar,
        age: memberData.age || '8 anos',
        level: memberData.level || 'Nível 1 - Iniciante',
        balance: memberData.balance ?? 100,
        accumulated: memberData.balance ?? 100,
        spent: 0,
        streakDays: 1,
        weekPercent: 85,
        badgeNumber: String(childrenData.length + 1),
        badgeLabel: 'Novo Membro',
      };
      updatedChildren = [...childrenData, newChild];
    }

    setChildrenData(updatedChildren);
    try { localStorage.setItem('rotinas_children', JSON.stringify(updatedChildren)); } catch {}
    setTasks((prev) => prev.map((t) => t.childId === memberData.id ? { ...t, childName: memberData.name } : t));
    setTransactions((prev) => prev.map((tx) => tx.childId === memberData.id ? { ...tx, childName: memberData.name } : tx));
    if (isSupabaseConfigured) syncUpsertFamilyMember({ id: memberData.id, name: memberData.name, role: 'child', avatarUrl: memberData.avatar, balance: memberData.balance });
    showToast('Membro Salvo', `Perfil de ${memberData.name} atualizado.`, 'person');
  };

  // ─── Exclusão em Cascata ─────────────────────────────────────────────────────
  const handleDeleteMember = (memberId: string) => {
    const member = childrenData.find((c) => c.id === memberId);

    // Remove o filho
    setChildrenData((prev) => {
      const filtered = prev.filter((c) => c.id !== memberId);
      try { localStorage.setItem('rotinas_children', JSON.stringify(filtered)); } catch {}
      return filtered;
    });

    // Remove tarefas do filho
    setTasks((prev) => prev.filter((t) => t.childId !== memberId));

    // Remove recompensas do filho
    setRewards((prev) => prev.filter((r) => r.childId !== memberId));

    // Remove transações do filho no extrato
    setTransactions((prev) => prev.filter((tx) => tx.childId !== memberId));

    // Remove notificações relacionadas (opcional)
    setNotifications((prev) => prev.filter((n) => !n.title.includes(member?.name || '__')));

    if (isSupabaseConfigured) syncDeleteFamilyMember(memberId);
    showToast('Membro Excluído', `${member?.name || 'Membro'} e todos os dados associados foram removidos.`, 'delete');
  };

  const handleUpdateChildName = (childId: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setChildrenData((prev) => {
      const updated = prev.map((c) => c.id === childId ? { ...c, name: trimmed } : c);
      try { localStorage.setItem('rotinas_children', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setTasks((prev) => prev.map((t) => t.childId === childId ? { ...t, childName: trimmed } : t));
    setTransactions((prev) => prev.map((tx) => tx.childId === childId ? { ...tx, childName: trimmed } : tx));
    if (isSupabaseConfigured) syncUpdateFamilyMemberName(childId, trimmed);
  };

  // ─── Tarefas ─────────────────────────────────────────────────────────────────
  const handleSaveEditedTask = (updatedTask: RoutineTask) => {
    setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t));
    if (isSupabaseConfigured) syncUpsertTask(updatedTask);
    showToast('Atividade Atualizada', `"${updatedTask.title}" foi atualizada.`, 'edit');
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (isSupabaseConfigured) syncDeleteTask(taskId);
    showToast('Atividade Excluída', `"${task?.title || 'Atividade'}" foi excluída.`, 'delete');
  };

  const handleAddTask = (newTask: RoutineTask) => {
    setTasks((prev) => [newTask, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Nova tarefa: ${newTask.title}`,
      message: `Atribuída a ${newTask.childName} (+${newTask.points} pts).`,
      time: 'Agora',
      unread: true,
      type: 'routine',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    syncUpsertTask(newTask);
    syncInsertNotification(newNotif);
    showToast('Atividade Cadastrada', 'Disponível no catálogo e na rotina da família.', 'add_task');
  };

  // ─── Aprovações ──────────────────────────────────────────────────────────────
  const handleApproveTask = (taskId: string, customFeedback?: string, customPoints?: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const pts = customPoints !== undefined ? customPoints : task.points;
    const updatedTask = { ...task, status: 'approved' as const, points: pts, feedback: customFeedback || task.feedback };
    setTasks((prev) => prev.map((t) => t.id === taskId ? updatedTask : t));
    syncUpsertTask(updatedTask);
    setChildrenData((prev) =>
      prev.map((c) => {
        if (c.id !== task.childId) return c;
        const newBal = c.balance + pts;
        const newAcc = c.accumulated + pts;
        syncUpdateChildBalance(c.id, newBal, newAcc, c.spent);
        return { ...c, balance: newBal, accumulated: newAcc };
      })
    );
    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      childId: task.childId,
      childName: task.childName,
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: task.title,
      type: 'earned',
      points: pts,
      category: task.category,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('Atividade Aprovada!', `+${pts} pontos para ${task.childName}.`, 'verified');
  };

  const handleRejectTask = (taskId: string, reason?: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updatedTask = { ...task, status: 'rejected' as const, feedback: reason || 'Necessário revisar a rotina.' };
    setTasks((prev) => prev.map((t) => t.id === taskId ? updatedTask : t));
    syncUpsertTask(updatedTask);
    showToast('Atividade Rejeitada', `Orientação registrada para ${task.childName}.`, 'cancel');
  };

  const handleBatchApproveOnTime = () => {
    const onTimeTasks = tasks.filter((t) => t.status === 'pending' && t.onTime);
    if (onTimeTasks.length === 0) return;
    let totalPoints = 0;
    const byChild: Record<string, number> = {};
    onTimeTasks.forEach((t) => { totalPoints += t.points; byChild[t.childId] = (byChild[t.childId] || 0) + t.points; });
    setTasks((prev) =>
      prev.map((t) => (t.status === 'pending' && t.onTime ? { ...t, status: 'approved', feedback: 'Aprovado em lote.' } : t))
    );
    setChildrenData((prev) =>
      prev.map((c) => { const added = byChild[c.id] || 0; return { ...c, balance: c.balance + added, accumulated: c.accumulated + added }; })
    );
    const newTx: PointTransaction = {
      id: `tx-batch-${Date.now()}`,
      childId: 'batch',
      childName: parentProfile.familyName || 'Família',
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Aprovação em lote (${onTimeTasks.length} rotinas no prazo)`,
      type: 'earned',
      points: totalPoints,
      category: 'Geral',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('Lote Processado!', `${onTimeTasks.length} tarefas aprovadas (+${totalPoints} pts).`, 'done_all');
  };

  // ─── Recompensas ─────────────────────────────────────────────────────────────
  const handleSaveReward = (reward: RewardItem | Omit<RewardItem, 'id'>) => {
    const fullReward: RewardItem =
      'id' in reward && reward.id ? (reward as RewardItem) : { ...(reward as Omit<RewardItem, 'id'>), id: `reward-${Date.now()}` };
    setRewards((prev) => {
      const idx = prev.findIndex((r) => r.id === fullReward.id);
      return idx >= 0 ? prev.map((r) => r.id === fullReward.id ? fullReward : r) : [fullReward, ...prev];
    });
    if (isSupabaseConfigured) syncUpsertReward(fullReward);
    showToast('Incentivo Salvo', `"${fullReward.title}" atualizado.`, 'card_giftcard');
  };

  const handleDeleteReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    setRewards((prev) => prev.filter((r) => r.id !== rewardId));
    if (isSupabaseConfigured) syncDeleteReward(rewardId);
    showToast('Incentivo Excluído', `"${reward?.title || 'Item'}" foi removido.`, 'delete');
  };

  const handleDeliverReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;
    setRewards((prev) =>
      prev.map((r) =>
        r.id === rewardId
          ? { ...r, status: 'delivered', deliveredAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : r
      )
    );
    showToast('Incentivo Entregue!', `"${reward.title}" entregue para ${reward.childName}.`, 'celebration');
  };

  // ─── Modo Filho ──────────────────────────────────────────────────────────────
  const handleCompleteTaskByChild = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedTask = { ...task, status: 'pending' as const, completedAt: time, timingLabel: `Enviada às ${time} (Aguardando auditoria)` };
    setTasks((prev) => prev.map((t) => t.id === taskId ? updatedTask : t));
    const newNotif: NotificationItem = {
      id: `notif-audit-${Date.now()}`,
      title: `Auditoria Pendente: ${task.title}`,
      message: `${task.childName} confirmou a realização (${time}). Audite para liberar ${task.points} pontos.`,
      time: 'Agora',
      unread: true,
      type: 'routine',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    syncUpsertTask(updatedTask);
    syncInsertNotification(newNotif);
    showToast('Tarefa Confirmada!', `${task.childName} confirmou. Aguardando auditoria dos pais.`, 'fact_check');
  };

  const handleRequestRewardByChild = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;
    const child = childrenData.find((c) => c.id === reward.childId);
    if (!child || child.balance < reward.cost) {
      showToast('Pontos insuficientes', 'Continue fazendo suas tarefas para juntar mais pontos.', 'warning');
      return;
    }
    setChildrenData((prev) => prev.map((c) => c.id === child.id ? { ...c, balance: c.balance - reward.cost, spent: c.spent + reward.cost } : c));
    setRewards((prev) =>
      prev.map((r) => r.id === rewardId ? { ...r, status: 'pending', requestedAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : r)
    );
    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      childId: child.id,
      childName: child.name,
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Resgate: ${reward.title}`,
      type: 'spent',
      points: reward.cost,
      category: 'Incentivo',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('Resgate Solicitado!', 'Aguarde a entrega pelo responsável.', 'card_giftcard');
  };

  // ─── Ajuste Manual de Pontos ─────────────────────────────────────────────────
  const handleAddManualAdjustment = (childId: string, pts: number, reason: string) => {
    const child = childrenData.find((c) => c.id === childId);
    if (!child) return;
    setChildrenData((prev) =>
      prev.map((c) =>
        c.id === childId
          ? { ...c, balance: Math.max(0, c.balance + pts), accumulated: pts > 0 ? c.accumulated + pts : c.accumulated, spent: pts < 0 ? c.spent + Math.abs(pts) : c.spent }
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
    showToast('Ajuste Concluído', `${pts >= 0 ? '+' : ''}${pts} pts para ${child.name}.`, pts >= 0 ? 'monetization_on' : 'warning');
  };

  // ─── Categorias ──────────────────────────────────────────────────────────────
  const handleAddCategory = (name: string) => {
    if (categories.includes(name)) return;
    const updated = [...categories, name];
    setCategories(updated);
    try { localStorage.setItem('rotinas_categories', JSON.stringify(updated)); } catch {}
    showToast('Categoria Criada', `"${name}" adicionada.`, 'category');
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    const updated = categories.map((c) => c === oldName ? newName : c);
    setCategories(updated);
    try { localStorage.setItem('rotinas_categories', JSON.stringify(updated)); } catch {}
    setTasks((prev) => prev.map((t) => t.category === oldName ? { ...t, category: newName } : t));
    showToast('Categoria Atualizada', `"${oldName}" → "${newName}".`, 'edit');
  };

  const handleDeleteCategory = (name: string) => {
    if (categories.length <= 1) { alert('Mantenha pelo menos uma categoria.'); return; }
    const updated = categories.filter((c) => c !== name);
    setCategories(updated);
    try { localStorage.setItem('rotinas_categories', JSON.stringify(updated)); } catch {}
    showToast('Categoria Excluída', `"${name}" removida.`, 'delete');
  };

  // ─── Auth ────────────────────────────────────────────────────────────────────
  const handleAuthSuccess = (user: FamilyAuthUser) => {
    setCurrentUser(user);
    try { localStorage.setItem('rotinas_auth_user', JSON.stringify(user)); } catch {}
    if (user.role === 'child' && user.childId) {
      setSelectedChildFilter(user.childId);
      setChildModeState({ isOpen: true, childId: user.childId });
    }
  };

  const handleAuthLogout = () => {
    signOutSupabase();
    setCurrentUser(null);
    try { localStorage.removeItem('rotinas_auth_user'); } catch {}
    showToast('Sessão Encerrada', 'Você saiu da conta familiar.', 'logout');
  };

  // ─── Reset ───────────────────────────────────────────────────────────────────
  const handleResetData = () => {
    setChildrenData(INITIAL_CHILDREN);
    setTasks(INITIAL_TASKS);
    setRewards(INITIAL_REWARDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    const defaultProfile: ParentProfile = {
      fatherName: 'Pai Admin',
      motherName: 'Mãe Admin',
      familyName: 'Família Silva',
      email: 'luizaugustomarcondessilveira@gmail.com',
      role: 'Administrador Chefe',
    };
    setParentProfile(defaultProfile);
    setSelectedFamily('Família Silva');
    try {
      localStorage.removeItem('rotinas_children');
      localStorage.removeItem('rotinas_parent_profile');
      localStorage.removeItem('rotinas_auth_user');
    } catch {}
    showToast('Dados Zerados', 'Todos os dados foram restaurados para o padrão.', 'restart_alt');
  };

  // ─── Contadores ──────────────────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => n.unread).length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;

  // ─── Tela de Login ───────────────────────────────────────────────────────────
  if (!loginDone) {
    return (
      <LoginScreen
        childrenData={childrenData}
        parentProfile={parentProfile}
        onLogin={handleLogin}
        themeMode={themeMode}
        onThemeChange={handleThemeChange}
      />
    );
  }

  // ─── App Principal ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased selection:bg-amber-200 transition-colors duration-200">
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isPinLocked={isPinLocked}
        onTogglePinLock={() => {
          if (isPinLocked) { setPinModalState({ isOpen: true, mode: 'unlock' }); }
          else { setIsPinLocked(true); showToast('Painel Bloqueado', 'Use seu PIN para reabrir.', 'lock'); }
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        pendingCount={pendingCount}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        familyName={parentProfile.familyName}
      />

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewActivity={() => setIsNewActivityOpen(true)}
          onOpenChildMode={(childId) => setChildModeState({ isOpen: true, childId: childId || 'lucas' })}
          notifications={notifications}
          onMarkNotificationRead={(id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n))}
          selectedFamily={selectedFamily}
          onChangeFamily={setSelectedFamily}
          onOpenEditFamilyName={() => setIsEditFamilyNameOpen(true)}
          unreadCount={unreadCount}
          themeMode={themeMode}
          onThemeChange={handleThemeChange}
          onSelectView={(view) => setCurrentView(view)}
          parentProfile={parentProfile}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleAuthLogout}
        />

        <main className="w-full pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1">
          {isPinLocked ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#081534] text-white flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Sessão dos Pais Bloqueada</h2>
              <p className="text-xs text-slate-500">O painel administrativo está protegido.</p>
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
                  onOpenPinChangeModal={() => setPinModalState({ isOpen: true, mode: 'change' })}
                  onEditTask={(task) => { setEditingTask(task); setIsEditTaskOpen(true); }}
                  onDeleteTask={handleDeleteTask}
                />
              )}

              {currentView === 'catalogo-de-atividades' && (
                <ActivitiesCatalog
                  tasks={tasks}
                  childrenData={childrenData}
                  categories={categories}
                  onOpenNewActivity={() => setIsNewActivityOpen(true)}
                  onOpenManageCategories={() => setIsManageCategoriesOpen(true)}
                  selectedChildFilter={selectedChildFilter}
                  onFilterChild={setSelectedChildFilter}
                  onEditTask={(task) => { setEditingTask(task); setIsEditTaskOpen(true); }}
                  onDeleteTask={handleDeleteTask}
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
                  onAddNewReward={handleSaveReward}
                  onEditReward={(reward) => { setEditingReward(reward); setIsEditRewardOpen(true); }}
                  onDeleteReward={handleDeleteReward}
                />
              )}

              {currentView === 'membros-da-familia' && (
                <FamilyMembers
                  childrenData={childrenData}
                  onOpenChildMode={(childId) => setChildModeState({ isOpen: true, childId })}
                  parentProfile={parentProfile}
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  onOpenSettings={() => setCurrentView('configuracoes')}
                  onUpdateChildName={handleUpdateChildName}
                  onSaveMember={handleSaveMember}
                  onDeleteMember={handleDeleteMember}
                  onSaveFamilyName={handleSaveFamilyName}
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
                  parentProfile={parentProfile}
                  onUpdateParentProfile={handleUpdateParentProfile}
                  childrenData={childrenData}
                  onUpdateChildName={handleUpdateChildName}
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  onLogout={handleAuthLogout}
                  onLogoutToLogin={handleLogoutToLogin}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAIS */}
      <NewActivityModal isOpen={isNewActivityOpen} onClose={() => setIsNewActivityOpen(false)} childrenData={childrenData} onAddTask={handleAddTask} />
      <EditActivityModal isOpen={isEditTaskOpen} onClose={() => { setIsEditTaskOpen(false); setEditingTask(null); }} task={editingTask} categories={categories} childrenData={childrenData} onSaveTask={handleSaveEditedTask} onDeleteTask={handleDeleteTask} />
      <EditRewardModal isOpen={isEditRewardOpen} onClose={() => { setIsEditRewardOpen(false); setEditingReward(null); }} reward={editingReward} childrenData={childrenData} onSaveReward={handleSaveReward} onDeleteReward={handleDeleteReward} />
      <ManageCategoriesModal isOpen={isManageCategoriesOpen} onClose={() => setIsManageCategoriesOpen(false)} categories={categories} onAddCategory={handleAddCategory} onEditCategory={handleEditCategory} onDeleteCategory={handleDeleteCategory} />
      <EditFamilyNameModal isOpen={isEditFamilyNameOpen} onClose={() => setIsEditFamilyNameOpen(false)} currentFamilyName={parentProfile.familyName || 'Família Silva'} onSaveFamilyName={handleSaveFamilyName} />
      <ProofPhotoModal isOpen={Boolean(proofPhotoTask)} task={proofPhotoTask} onClose={() => setProofPhotoTask(null)} onRequestNewPhoto={() => showToast('Pedido Enviado!', 'Notificação emitida para o tablet da criança.', 'photo_camera')} onDirectApprove={(taskId) => handleApproveTask(taskId)} />
      <ChildModeModal isOpen={childModeState.isOpen} onClose={() => setChildModeState({ isOpen: false, childId: 'lucas' })} activeChildId={childModeState.childId} childrenData={childrenData} tasks={tasks} rewards={rewards} onCompleteTaskByChild={handleCompleteTaskByChild} onRequestRewardByChild={handleRequestRewardByChild} />
      <PinSecurityModal isOpen={pinModalState.isOpen} onClose={() => setPinModalState({ isOpen: false, mode: 'unlock' })} correctPin={pinCode} mode={pinModalState.mode} onSuccessUnlock={() => { setIsPinLocked(false); showToast('Painel Desbloqueado!', 'Acesso administrativo concedido.', 'lock_open'); }} onUpdatePin={(newPin) => { setPinCode(newPin); showToast('Novo PIN Salvo!', 'O código foi atualizado.', 'verified'); }} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} currentUser={currentUser} onAuthSuccess={handleAuthSuccess} onLogout={handleAuthLogout} onShowToast={showToast} childrenData={childrenData} />

      {/* TOAST */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#081534] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/50 transition-all duration-300 pointer-events-auto ${toast.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-95 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[#fea619] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{toast.icon}</span>
        <div>
          <div className="font-bold text-sm leading-tight text-white">{toast.title}</div>
          <div className="text-xs text-[#bac5ee] mt-0.5">{toast.desc}</div>
        </div>
      </div>
    </div>
  );
}
