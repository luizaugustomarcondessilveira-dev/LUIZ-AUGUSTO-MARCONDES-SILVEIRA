'use client';

import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Child, ParentProfile, FamilyAuthUser } from '@/lib/types';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsViewProps {
  currentPin: string;
  onUpdatePin: (newPin: string) => void;
  onResetData: () => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
  themeMode?: ThemeMode;
  onThemeChange?: (newTheme: ThemeMode) => void;
  parentProfile?: ParentProfile;
  onUpdateParentProfile?: (profile: ParentProfile) => void;
  childrenData?: Child[];
  onUpdateChildName?: (childId: string, newName: string) => void;
  currentUser?: FamilyAuthUser | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  onLogoutToLogin?: () => void;
}

export default function SettingsView({
  currentPin,
  onUpdatePin,
  onResetData,
  onShowToast,
  themeMode = 'light',
  onThemeChange,
  parentProfile = {
    fatherName: 'Pai Admin',
    motherName: 'Mãe Admin',
    familyName: 'Família Silva',
    email: 'luizaugustomarcondessilveira@gmail.com',
    role: 'Administrador Chefe',
  },
  onUpdateParentProfile,
  childrenData = [],
  onUpdateChildName,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onLogoutToLogin,
}: SettingsViewProps) {
   const [pin, setPin] = useState(currentPin);
  const [delayTolerance, setDelayTolerance] = useState('15');
  const [defaultPenalty, setDefaultPenalty] = useState('10');
  const [allowPhotoSkip, setAllowPhotoSkip] = useState(false);
  const [autoApproveOnTime, setAutoApproveOnTime] = useState(false);
  const [showDbDetails, setShowDbDetails] = useState(false);

  // Profile Edit State
  const [fatherName, setFatherName] = useState(parentProfile.fatherName || 'Pai Admin');
  const [motherName, setMotherName] = useState(parentProfile.motherName || 'Mãe Admin');
  const [familyName, setFamilyName] = useState(parentProfile.familyName || 'Família Silva');
  const [childrenNames, setChildrenNames] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    childrenData.forEach((c) => {
      initial[c.id] = c.name;
    });
    return initial;
  });

  const handleChildNameChange = (childId: string, value: string) => {
    setChildrenNames((prev) => ({
      ...prev,
      [childId]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      onShowToast('PIN Inválido', 'O PIN deve conter exatamente 4 números.', 'error');
      return;
    }
    onUpdatePin(pin);

    // Save parent profile changes
    if (onUpdateParentProfile) {
      onUpdateParentProfile({
        ...parentProfile,
        fatherName: fatherName.trim() || 'Pai Admin',
        motherName: motherName.trim() || 'Mãe Admin',
        familyName: familyName.trim() || 'Família Silva',
      });
    }

    // Save children names
    if (onUpdateChildName) {
      Object.entries(childrenNames).forEach(([childId, name]) => {
        if (name.trim()) {
          onUpdateChildName(childId, name.trim());
        }
      });
    }

    onShowToast(
      'Configurações Salvas!',
      'Nomes dos pais, dos filhos e regras familiares foram atualizados com sucesso.',
      'verified'
    );
  };

  return (
    <div className="flex flex-col w-full pb-12 gap-6" id="view-configuracoes">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-primary-container text-on-primary rounded-lg material-symbols-outlined text-[20px]">
            settings
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
            Configurações & Perfis da Família
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Edição de nomes dos pais e dos filhos, contas com Supabase Auth, regras de auditoria e segurança por PIN.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* =================================================================== */}
        {/* 1. EDIÇÃO DE PERFIL FAMILIAR (PAIS & FILHOS) */}
        {/* =================================================================== */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-5 md:col-span-2">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed material-symbols-outlined text-[22px]">
                manage_accounts
              </span>
              <div>
                <h2 className="font-bold text-base text-on-surface">
                  Edição de Perfil Familiar (Nomes dos Pais e Filhos)
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Personalize os nomes de exibição dos pais e de cada filho em todas as telas do sistema.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              Sincronização em Tempo Real
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nome do Pai */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <label className="block text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">person</span>
                <span>Nome do Pai / Administrador</span>
              </label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="ex: Carlos Silva"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-sm font-semibold text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
              />
              <span className="text-[11px] text-on-surface-variant block">
                Exibido no cabeçalho e na auditoria
              </span>
            </div>

            {/* Nome da Mãe */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <label className="block text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-purple-600 text-[18px]">person_outline</span>
                <span>Nome da Mãe / Co-Admin</span>
              </label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="ex: Mariana Silva"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-sm font-semibold text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
              />
              <span className="text-[11px] text-on-surface-variant block">
                Exibido no card de administradores
              </span>
            </div>

            {/* Nome do Grupo Familiar */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <label className="block text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">family_restroom</span>
                <span>Sobrenome / Grupo Familiar</span>
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="ex: Família Silva"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-sm font-semibold text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
              />
              <span className="text-[11px] text-on-surface-variant block">
                Identificador do seletor superior
              </span>
            </div>
          </div>

          {/* Seção dos Filhos */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">child_care</span>
              <span>Nomes dos Filhos Cadastrados</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {childrenData.map((child) => (
                <div
                  key={child.id}
                  className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2.5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={child.avatar}
                      alt={child.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Perfil do Filho: {child.id}
                      </span>
                      <div className="text-xs font-bold text-on-surface truncate">
                        {child.age} • Saldo: {child.balance} pts
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-on-surface mb-1">
                      Nome de Exibição:
                    </label>
                    <input
                      type="text"
                      value={childrenNames[child.id] ?? child.name}
                      onChange={(e) => handleChildNameChange(child.id, e.target.value)}
                      placeholder={`Nome de ${child.name}`}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-sm font-bold text-on-surface border border-outline-variant/40 focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <span className="text-[10px] text-on-surface-variant">
                    Atualiza automaticamente tarefas, carteira e loja deste filho.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. CADASTRO & LOGIN DOS MEMBROS (SUPABASE AUTH) */}
        {/* =================================================================== */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">vpn_key</span>
              </div>
              <div>
                <h2 className="font-bold text-base text-on-surface flex items-center gap-2">
                  <span>Autenticação & Contas dos Membros (Supabase Auth)</span>
                  {isSupabaseConfigured ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Supabase Conectado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                      Modo Local / Demo Ativo
                    </span>
                  )}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Cada membro da família (pais e filhos) pode ter sua conta com email e senha no Supabase.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-2xs transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>Abrir Cadastro & Login</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Conta Atual */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Status da Sessão Atual
                </span>
                {currentUser && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed">
                    {currentUser.role === 'parent'
                      ? 'Pai / Admin'
                      : currentUser.role === 'co_parent'
                      ? 'Mãe / Co-Admin'
                      : 'Filho / Membro'}
                  </span>
                )}
              </div>

              {currentUser ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-on-surface">{currentUser.name}</div>
                      <div className="text-xs text-on-surface-variant">{currentUser.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenAuthModal}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Trocar Conta
                    </button>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-on-surface-variant">
                    Nenhum membro autenticado no momento (usando modo visitante).
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Fazer Login Agora</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>

            {/* Guia Supabase */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5 text-xs text-on-surface-variant">
              <div className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-700 dark:text-emerald-400 text-[18px]">
                  security
                </span>
                <span>Contas Familiares</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Os pais têm acesso total às aprovações e trocas de PIN; os filhos acessam suas rotinas e solicitam recompensas.
              </p>
            </div>
          </div>
        </div>

        {/* Appearance & Theme Toggle Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 material-symbols-outlined text-[22px]">
                palette
              </span>
              <div>
                <h2 className="font-bold text-base text-on-surface">Tema & Aparência Visual</h2>
                <p className="text-xs text-on-surface-variant">
                  Alterne entre o modo claro e escuro utilizando as variáveis do Tailwind definidas no globals.css.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                Tailwind CSS Variables
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Modo Claro */}
            <button
              type="button"
              id="theme-option-light"
              onClick={() => onThemeChange?.('light')}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left cursor-pointer ${
                themeMode === 'light'
                  ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 ring-2 ring-amber-500/30 shadow-xs'
                  : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">light_mode</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-on-surface flex items-center justify-between">
                  <span>Modo Claro</span>
                  {themeMode === 'light' && (
                    <span className="text-[10px] text-amber-800 font-bold px-1.5 py-0.5 rounded bg-amber-200">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Superfície clara suave para o dia
                </p>
              </div>
            </button>

            {/* Modo Escuro */}
            <button
              type="button"
              id="theme-option-dark"
              onClick={() => onThemeChange?.('dark')}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left cursor-pointer ${
                themeMode === 'dark'
                  ? 'border-indigo-400 bg-indigo-950/40 ring-2 ring-indigo-400/30 shadow-xs'
                  : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-900 text-indigo-200 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">dark_mode</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-on-surface flex items-center justify-between">
                  <span>Modo Escuro</span>
                  {themeMode === 'dark' && (
                    <span className="text-[10px] text-indigo-300 font-bold px-1.5 py-0.5 rounded bg-indigo-900/80">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Superfície escura para a noite
                </p>
              </div>
            </button>

            {/* Automático (Sistema) */}
            <button
              type="button"
              id="theme-option-system"
              onClick={() => onThemeChange?.('system')}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left cursor-pointer ${
                themeMode === 'system'
                  ? 'border-primary bg-surface-container-high ring-2 ring-primary/20 shadow-xs'
                  : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">brightness_auto</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-on-surface flex items-center justify-between">
                  <span>Automático</span>
                  {themeMode === 'system' && (
                    <span className="text-[10px] text-on-surface font-bold px-1.5 py-0.5 rounded bg-surface-container-highest">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Segue o tema do seu dispositivo
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Security / PIN card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              shield_lock
            </span>
            <h2 className="font-bold text-base text-on-surface">Segurança & Bloqueio Parental</h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            O PIN de 4 dígitos é solicitado para autorizar aprovações de pontos e resgates em aparelhos compartilhados.
          </p>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Código PIN do Pai (4 Dígitos)
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-32 h-10 px-3 tracking-widest text-center rounded-lg bg-surface-container-low text-lg font-bold text-on-surface outline-none border border-outline-variant/40 focus:border-primary"
            />
            <span className="text-[11px] text-on-surface-variant block mt-1">
              Padrão configurado: ••••
            </span>
          </div>

          <div className="pt-2 border-t border-outline-variant/20 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-on-surface">
              <input
                type="checkbox"
                checked={allowPhotoSkip}
                onChange={(e) => setAllowPhotoSkip(e.target.checked)}
                className="w-4 h-4 rounded accent-[#081534]"
              />
              <span>Permitir aprovação manual sem exigência de foto obrigatória</span>
            </label>
          </div>
        </div>

        {/* Audit & Penalty Rules */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-[20px]">
              gavel
            </span>
            <h2 className="font-bold text-base text-on-surface">Regras de Atraso e Penalidade</h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            Defina o tempo de tolerância antes de sinalizar atraso e a dedução pedagógica padrão.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Tolerância de Horário (min)
              </label>
              <input
                type="number"
                value={delayTolerance}
                onChange={(e) => setDelayTolerance(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-sm font-bold text-on-surface outline-none border border-outline-variant/40 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Penalidade Padrão (pts)
              </label>
              <input
                type="number"
                value={defaultPenalty}
                onChange={(e) => setDefaultPenalty(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-sm font-bold text-on-surface outline-none border border-outline-variant/40 focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/20">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-on-surface">
              <input
                type="checkbox"
                checked={autoApproveOnTime}
                onChange={(e) => setAutoApproveOnTime(e.target.checked)}
                className="w-4 h-4 rounded accent-[#081534]"
              />
              <span>Aprovar automaticamente tarefas de rotina simples concluídas no prazo</span>
            </label>
          </div>
        </div>

        {/* Supabase & Cloud Database Card (Compact & Elegant) */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">database</span>
              </div>
              <div>
                <h2 className="font-bold text-base text-on-surface flex items-center gap-2">
                  <span>Persistência em Nuvem (Supabase)</span>
                  {isSupabaseConfigured ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Conectado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant/40">
                      Esquema Pronto
                    </span>
                  )}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Banco PostgreSQL com suporte a tempo real, histórico de auditoria e segurança por linha (RLS).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDbDetails(!showDbDetails)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {showDbDetails ? 'expand_less' : 'tune'}
              </span>
              <span>{showDbDetails ? 'Ocultar Detalhes' : 'Ver Detalhes da Conexão'}</span>
            </button>
          </div>

          {showDbDetails && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/20 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[16px]">description</span>
                  <span>Migração SQL Automatizada</span>
                </div>
                <p className="text-[11px] font-mono text-on-surface-variant bg-surface-container-high px-2 py-1 rounded truncate">
                  supabase/migrations/...schema.sql
                </p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Cria 5 tabelas: rotinas, membros, carteiras, recompensas e notificações.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-amber-600 text-[16px]">key</span>
                  <span>Variáveis de Ambiente</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Configuradas em <code className="font-bold">.env.example</code>:
                </p>
                <div className="text-[10px] font-mono text-on-surface-variant flex gap-1 flex-wrap">
                  <span className="bg-surface-container-high px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</span>
                  <span className="bg-surface-container-high px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ações e Salvar */}
        <div className="md:col-span-2 flex flex-col gap-3 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm('Tem certeza que deseja zerar todos os dados? Esta ação não pode ser desfeita.')) {
                  onResetData();
                  onShowToast('Dados Zerados', 'Todos os dados foram restaurados para o padrão.', 'restart_alt');
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-950/60 font-bold text-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              <span>Zerar Todos os Dados</span>
            </button>

            {onLogoutToLogin && (
              <button
                type="button"
                onClick={() => {
                  if (onLogout) onLogout();
                  onLogoutToLogin();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface-variant border border-outline-variant/30 font-bold text-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sair para Tela de Login</span>
              </button>
            )}
          </div>

          <div className="border-t border-outline-variant/20 pt-3 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Salvar Todas as Alterações
            </button>
          </div>
        </div>
