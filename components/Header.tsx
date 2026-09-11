'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PARENT_USER } from '@/lib/initial-data';
import { NotificationItem, ParentProfile, FamilyAuthUser } from '@/lib/types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenNewActivity: () => void;
  onOpenChildMode: (childId?: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  selectedFamily: string;
  onChangeFamily: (fam: string) => void;
  onOpenEditFamilyName?: () => void;
  unreadCount: number;
  themeMode?: 'light' | 'dark' | 'system';
  onThemeChange?: (newTheme: 'light' | 'dark' | 'system') => void;
  onSelectView?: (viewId: string) => void;
  parentProfile?: ParentProfile;
  currentUser?: FamilyAuthUser | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export default function Header({
  onOpenMobileMenu,
  onOpenNewActivity,
  onOpenChildMode,
  notifications,
  onMarkNotificationRead,
  selectedFamily,
  onChangeFamily,
  onOpenEditFamilyName,
  unreadCount,
  themeMode = 'light',
  onThemeChange,
  onSelectView,
  parentProfile = {
    fatherName: 'Pai Admin',
    motherName: 'Mãe Admin',
    familyName: 'Família Silva',
    email: 'luizaugustomarcondessilveira@gmail.com',
    role: 'Administrador Chefe',
  },
  currentUser,
  onOpenAuthModal,
  onLogout,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const famRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (famRef.current && !famRef.current.contains(event.target as Node)) {
        setShowFamilyDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="app-header"
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 lg:px-8 border-b border-surface-container transition-colors duration-200"
    >
      {/* Left side: Mobile Toggle + Family Selector */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu-toggle"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
          aria-label="Abrir menu lateral"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Family Selector Dropdown */}
        <div className="relative flex items-center gap-1" ref={famRef}>
          <button
            id="btn-family-selector"
            onClick={() => setShowFamilyDropdown(!showFamilyDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">home</span>
            <span className="font-semibold text-sm text-on-surface">{selectedFamily}</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              arrow_drop_down
            </span>
          </button>

          {onOpenEditFamilyName && (
            <button
              type="button"
              onClick={onOpenEditFamilyName}
              title="Renomear grupo familiar"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">edit</span>
            </button>
          )}

          {showFamilyDropdown && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Selecione o Grupo Familiar
              </div>
              <button
                onClick={() => {
                  onChangeFamily(parentProfile.familyName || 'Família Silva');
                  setShowFamilyDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-on-surface hover:bg-surface-container flex items-center justify-between font-medium"
              >
                <span>{parentProfile.familyName || 'Família Silva'}</span>
                {selectedFamily === (parentProfile.familyName || 'Família Silva') && (
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">
                    check
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  onChangeFamily('Casa dos Avós');
                  setShowFamilyDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-on-surface hover:bg-surface-container flex items-center justify-between font-medium"
              >
                <span>Casa dos Avós</span>
                {selectedFamily === 'Casa dos Avós' && (
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">
                    check
                  </span>
                )}
              </button>

              <div className="border-t border-outline-variant/20 my-1"></div>

              {onOpenEditFamilyName && (
                <button
                  type="button"
                  onClick={() => {
                    setShowFamilyDropdown(false);
                    onOpenEditFamilyName();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-primary hover:bg-surface-container font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Renomear este grupo familiar</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowFamilyDropdown(false);
                  onOpenEditFamilyName?.();
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-on-surface-variant hover:bg-surface-container font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_home</span>
                <span>Novo grupo familiar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Actions, Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Theme Toggle Button */}
        <button
          id="btn-header-theme-toggle"
          type="button"
          onClick={() => {
            const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
            onThemeChange?.(nextTheme);
          }}
          title={themeMode === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          aria-label="Alternar Tema Claro/Escuro"
          className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">
            {themeMode === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Button & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificações e Aprovações Pendentes"
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#fea619] text-[11px] font-bold text-[#2a1700] ring-2 ring-surface">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 bg-primary text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#fea619] text-[20px]">
                    notifications_active
                  </span>
                  <span className="font-bold text-sm">Notificações da Família</span>
                </div>
                <span className="text-xs bg-[#fea619]/20 text-[#ffddb8] font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} novas
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/20">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onMarkNotificationRead(n.id);
                      if (onSelectView && n.type === 'routine') {
                        onSelectView('dashboard-aprovacoes');
                        setShowNotifications(false);
                      }
                    }}
                    className={`p-3.5 hover:bg-surface-container-low transition-colors cursor-pointer flex items-start gap-3 ${
                      n.unread ? 'bg-amber-500/10' : ''
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        n.type === 'routine'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : n.type === 'reward'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {n.type === 'routine'
                          ? 'task_alt'
                          : n.type === 'reward'
                          ? 'redeem'
                          : 'info'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-on-surface truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-on-surface-variant shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                    </div>

                    {n.unread && (
                      <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 self-center"></span>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-3 py-2 bg-surface-container-low border-t border-outline-variant/20 text-center">
                <button
                  onClick={() => {
                    notifications.forEach((n) => onMarkNotificationRead(n.id));
                  }}
                  className="text-xs text-primary dark:text-primary-fixed hover:underline font-semibold cursor-pointer"
                >
                  Marcar todas como lidas
                </button>
              </div>
            </div>
          )}
        </div>

        {/* "+ Nova Atividade" Button */}
        <button
          id="btn-new-activity-header"
          onClick={onOpenNewActivity}
          className="flex items-center gap-1.5 bg-[#081534] hover:bg-[#1e2a4a] text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-all font-semibold text-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">Nova Atividade</span>
          <span className="sm:hidden">Nova</span>
        </button>

        <div className="h-6 w-px bg-[#e0e3e5]"></div>

        {/* User Profile / Modo Filho Trigger */}
        <div className="relative" ref={profileRef}>
          <div
            id="user-profile-menu-trigger"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 cursor-pointer group select-none p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {currentUser?.role === 'child' ? (
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
            ) : (
              <img
                src={PARENT_USER.avatar}
                alt={currentUser?.name || parentProfile.fatherName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-amber-400 transition-all"
              />
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-semibold text-xs text-on-surface leading-tight truncate max-w-[120px]">
                {currentUser ? currentUser.name : parentProfile.fatherName}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenChildMode();
                }}
                className="text-[11px] font-medium text-[#855300] dark:text-[#ffb95f] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">child_care</span>
                <span>Modo Filho</span>
              </button>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[18px]">
              expand_more
            </span>
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-68 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <div className="font-bold text-sm text-on-surface truncate">
                  {currentUser ? currentUser.name : parentProfile.fatherName}
                </div>
                <div className="text-xs text-on-surface-variant truncate">
                  {currentUser ? currentUser.email : parentProfile.email}
                </div>
                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary dark:text-primary-fixed px-2 py-0.5 rounded-full">
                    {currentUser
                      ? currentUser.role === 'parent'
                        ? 'Pai / Admin'
                        : currentUser.role === 'co_parent'
                        ? 'Mãe / Co-Admin'
                        : 'Filho / Membro'
                      : 'Administrador da Família'}
                  </span>
                  {currentUser?.isDemo && (
                    <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded">
                      Demo
                    </span>
                  )}
                </div>
              </div>

              {/* Account / Profile Quick Actions */}
              <div className="py-1 border-b border-outline-variant/20">
                <button
                  onClick={() => {
                    onSelectView?.('configuracoes');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    manage_accounts
                  </span>
                  <span>Editar Nomes & Configurações</span>
                </button>

                {onOpenAuthModal && (
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                      vpn_key
                    </span>
                    <span>{currentUser ? 'Trocar Conta / Cadastrar Membro' : 'Login / Cadastrar Conta'}</span>
                  </button>
                )}
              </div>

              <div className="py-1">
                <div className="px-3 py-1 text-[11px] font-bold uppercase text-on-surface-variant/70">
                  Alternar Visão Infantil
                </div>
                <button
                  onClick={() => {
                    onOpenChildMode('lucas');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-amber-500 text-[18px]">
                    face
                  </span>
                  <span>Ver visão de Lucas</span>
                </button>
                <button
                  onClick={() => {
                    onOpenChildMode('beatriz');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-amber-500 text-[18px]">
                    face_3
                  </span>
                  <span>Ver visão de Beatriz</span>
                </button>
              </div>

              {currentUser && onLogout && (
                <div className="border-t border-outline-variant/20 pt-1">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Desconectar Conta</span>
                  </button>
                </div>
              )}

              <div className="border-t border-outline-variant/20 pt-1">
                <div className="px-4 py-1 text-[11px] text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                  <span>Rotinas da Família • Supabase Auth</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
