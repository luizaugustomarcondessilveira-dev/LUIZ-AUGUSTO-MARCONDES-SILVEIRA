'use client';

import React, { useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsViewProps {
  currentPin: string;
  onUpdatePin: (newPin: string) => void;
  onResetData: () => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
  themeMode?: ThemeMode;
  onThemeChange?: (newTheme: ThemeMode) => void;
}

export default function SettingsView({
  currentPin,
  onUpdatePin,
  onResetData,
  onShowToast,
  themeMode = 'light',
  onThemeChange,
}: SettingsViewProps) {
  const [pin, setPin] = useState(currentPin);
  const [delayTolerance, setDelayTolerance] = useState('15');
  const [defaultPenalty, setDefaultPenalty] = useState('10');
  const [allowPhotoSkip, setAllowPhotoSkip] = useState(false);
  const [autoApproveOnTime, setAutoApproveOnTime] = useState(false);
  const [showDbDetails, setShowDbDetails] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      onShowToast('PIN Inválido', 'O PIN deve conter exatamente 4 números.', 'error');
      return;
    }
    onUpdatePin(pin);
    onShowToast('Configurações Salvas!', 'As regras familiares foram atualizadas com sucesso.', 'verified');
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
            Configurações do Sistema Familiar
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Gerencie temas visuais (claro/escuro), regras de auditoria, limites de tolerância e segurança por PIN.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Save button & Reset bar */}
        <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs">
          <button
            type="button"
            onClick={() => {
              onResetData();
              onShowToast('Dados Restaurados', 'As tarefas e saldos foram reiniciados.', 'restart_alt');
            }}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Restaurar Dados de Exemplo</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
