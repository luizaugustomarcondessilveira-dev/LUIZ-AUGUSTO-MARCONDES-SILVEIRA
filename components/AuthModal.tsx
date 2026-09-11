'use client';

import React, { useState } from 'react';
import { isSupabaseConfigured, signInWithSupabase, signUpWithSupabase, signOutSupabase } from '@/lib/supabase';
import { FamilyAuthUser, Child } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FamilyAuthUser | null;
  onAuthSuccess: (user: FamilyAuthUser) => void;
  onLogout: () => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
  childrenData: Child[];
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  onShowToast,
  childrenData,
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [familyRole, setFamilyRole] = useState<'parent' | 'co_parent' | 'child'>('parent');
  const [selectedChildId, setSelectedChildId] = useState(childrenData[0]?.id || 'lucas');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Por favor, informe seu email e senha.');
      return;
    }

    setLoading(true);
    try {
      const { data, error, isDemo } = await signInWithSupabase(email, password);
      if (error) {
        setErrorMessage(error.message || 'Falha ao autenticar com o Supabase.');
        setLoading(false);
        return;
      }

      const userMetadata = (data?.user?.user_metadata || {}) as Record<string, any>;
      const authUser: FamilyAuthUser = {
        id: data?.user?.id || `user-${Date.now()}`,
        email: data?.user?.email || email,
        name: userMetadata.name || email.split('@')[0],
        role: userMetadata.role || (email.includes('filho') || email.includes('lucas') || email.includes('beatriz') ? 'child' : 'parent'),
        childId: userMetadata.childId,
        isDemo,
      };

      onAuthSuccess(authUser);
      onShowToast(
        'Login Realizado!',
        `Bem-vindo(a), ${authUser.name}! ${isDemo ? '(Modo Demonstração)' : '(Supabase Auth)'}`,
        'verified_user'
      );
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro inesperado durante o login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Informe um email válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const metadata = {
        name: fullName.trim(),
        role: familyRole,
        childId: familyRole === 'child' ? selectedChildId : undefined,
      };

      const { data, error, isDemo } = await signUpWithSupabase(email, password, metadata);
      if (error) {
        setErrorMessage(error.message || 'Erro ao cadastrar membro no Supabase.');
        setLoading(false);
        return;
      }

      const authUser: FamilyAuthUser = {
        id: data?.user?.id || `user-${Date.now()}`,
        email: data?.user?.email || email,
        name: fullName.trim(),
        role: familyRole,
        childId: familyRole === 'child' ? selectedChildId : undefined,
        isDemo,
      };

      onAuthSuccess(authUser);
      onShowToast(
        'Conta Criada com Sucesso!',
        `Membro ${fullName.trim()} registrado no Supabase Auth.`,
        'how_to_reg'
      );
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: 'father' | 'mother' | 'lucas' | 'beatriz') => {
    let name = 'Pai Admin';
    let mail = 'pai.admin@familia.com';
    let r: 'parent' | 'co_parent' | 'child' = 'parent';
    let cId: string | undefined = undefined;

    if (role === 'father') {
      name = 'Pai Admin';
      mail = 'pai.admin@familia.com';
      r = 'parent';
    } else if (role === 'mother') {
      name = 'Mãe Admin';
      mail = 'mae.familia@familia.com';
      r = 'co_parent';
    } else if (role === 'lucas') {
      name = 'Lucas Silveira';
      mail = 'lucas@familia.com';
      r = 'child';
      cId = 'lucas';
    } else if (role === 'beatriz') {
      name = 'Beatriz Silveira';
      mail = 'beatriz@familia.com';
      r = 'child';
      cId = 'beatriz';
    }

    const demoUser: FamilyAuthUser = {
      id: `demo-${role}`,
      email: mail,
      name,
      role: r,
      childId: cId,
      isDemo: true,
    };

    onAuthSuccess(demoUser);
    onShowToast('Acesso Rápido Ativado', `Logado como ${name}`, 'lock_open');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="modal-auth-supabase"
    >
      <div
        className="bg-surface-container-lowest text-on-surface w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 pb-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">account_circle</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                {currentUser ? 'Gerenciamento de Conta' : tab === 'login' ? 'Acessar Conta Familiar' : 'Cadastrar Novo Membro'}
              </h2>
              <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                <span>Autenticação Supabase</span>
                <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
                {isSupabaseConfigured ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Nuvem Ativa
                  </span>
                ) : (
                  <span className="text-amber-700 dark:text-amber-300 font-medium">Modo Local / Demo</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Current Logged In Info (If logged in) */}
          {currentUser && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Usuário Atualmente Conectado
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed">
                  {currentUser.role === 'parent'
                    ? 'Pai / Admin'
                    : currentUser.role === 'co_parent'
                    ? 'Mãe / Co-Admin'
                    : 'Filho / Membro'}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-lg">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-on-surface truncate">{currentUser.name}</div>
                  <div className="text-xs text-on-surface-variant truncate">{currentUser.email}</div>
                  {currentUser.isDemo && (
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold">
                      Sessão Local Persistente
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    signOutSupabase();
                    onLogout();
                    onShowToast('Sessão Encerrada', 'Você saiu da sua conta.', 'logout');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/60 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sair</span>
                </button>
              </div>

              <div className="pt-2 border-t border-outline-variant/20 text-center">
                <p className="text-xs text-on-surface-variant">
                  Deseja alternar para outro membro ou cadastrar um novo? Use o formulário abaixo.
                </p>
              </div>
            </div>
          )}

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-container-low border border-outline-variant/30">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage('');
              }}
              className={`py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Entrar (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrorMessage('');
              }}
              className={`py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Cadastrar Membro
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tab: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Email de Acesso
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: pai.admin@familia.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Senha
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
                    lock
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha secreta"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    <span>Entrar no Sistema</span>
                  </>
                )}
              </button>

              {/* Quick Testing Accounts */}
              <div className="pt-3 border-t border-outline-variant/20">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                  Atalhos de Acesso Rápido para Testes:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('father')}
                    className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-left transition-colors flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">manage_accounts</span>
                    <span className="truncate">Pai (Admin)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('mother')}
                    className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-left transition-colors flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-purple-600 text-[18px]">person</span>
                    <span className="truncate">Mãe (Co-Admin)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('lucas')}
                    className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-left transition-colors flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">face</span>
                    <span className="truncate">Lucas (Filho)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('beatriz')}
                    className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-left transition-colors flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">face_3</span>
                    <span className="truncate">Beatriz (Filha)</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Tab: SIGN UP */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Nome do Membro
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
                    person
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex: Carlos Silva ou Lucas Silva"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Papel na Família
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFamilyRole('parent')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      familyRole === 'parent'
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                        : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] block mx-auto mb-0.5">
                      supervisor_account
                    </span>
                    <span className="text-xs">Pai / Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFamilyRole('co_parent')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      familyRole === 'co_parent'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold shadow-2xs'
                        : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] block mx-auto mb-0.5">
                      shield_person
                    </span>
                    <span className="text-xs">Mãe / Co-Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFamilyRole('child')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      familyRole === 'child'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold shadow-2xs'
                        : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] block mx-auto mb-0.5">
                      child_care
                    </span>
                    <span className="text-xs">Filho(a)</span>
                  </button>
                </div>
              </div>

              {familyRole === 'child' && (
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Vincular ao Perfil do Filho:
                  </label>
                  <select
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
                  >
                    {childrenData.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.age} - Saldo: {c.balance} pts)
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-on-surface-variant block mt-1">
                    Isso permitirá à criança acessar tarefas e pontos de seu perfil.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@familia.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Senha (mín. 6)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#fea619] hover:bg-[#ffb95f] text-[#2a1700] font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-[#2a1700] border-t-transparent rounded-full animate-spin"></span>
                    <span>Criando Conta...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                    <span>Criar Conta Familiar</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
