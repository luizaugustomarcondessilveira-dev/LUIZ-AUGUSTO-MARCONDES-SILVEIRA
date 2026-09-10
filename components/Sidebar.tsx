'use client';

import React from 'react';
import { LOGO_URL } from '@/lib/initial-data';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isPinLocked: boolean;
  onTogglePinLock: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingCount?: number;
}

export const NAV_ITEMS = [
  { id: 'dashboard-aprovacoes', label: 'Dashboard & Aprovações', icon: 'space_dashboard' },
  { id: 'catalogo-de-atividades', label: 'Catálogo de Atividades', icon: 'checklist' },
  { id: 'carteira-extrato', label: 'Carteira & Extrato', icon: 'account_balance_wallet' },
  { id: 'loja-de-recompensas', label: 'Loja de Recompensas', icon: 'redeem' },
  { id: 'membros-da-familia', label: 'Membros da Família', icon: 'groups' },
  { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
];

export default function Sidebar({
  currentView,
  onSelectView,
  isPinLocked,
  onTogglePinLock,
  isOpenMobile,
  onCloseMobile,
  pendingCount = 4,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none transition-transform duration-300 ease-in-out border-r border-surface-container-highest ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-surface-container-high">
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_URL}
                alt="Rotinas da Família Logo"
                className="h-8 w-auto object-contain drop-shadow-xs"
                onError={(e) => {
                  // Fallback if network blocked
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-bold text-base text-on-surface tracking-tight flex items-center gap-1">
                Rotinas da Família
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 tracking-wider">
                  Pais
                </span>
              </span>
            </div>

            {/* Close Button on Mobile */}
            <button
              id="sidebar-close-mobile-btn"
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface rounded-md"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 mt-4">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => {
                      onSelectView(item.id);
                      onCloseMobile();
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 text-left ${
                      isActive
                        ? 'bg-primary-container text-white font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive ? 'text-[#fea619]' : 'text-on-surface-variant'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.id === 'dashboard-aprovacoes' && pendingCount > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[11px] font-bold rounded-full ${
                          isActive
                            ? 'bg-[#fea619] text-[#2a1700]'
                            : 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100'
                        }`}
                      >
                        {pendingCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Status & PIN Security Toggle */}
        <div className="p-4 flex flex-col gap-2 bg-surface-container-lowest mx-3 mb-4 rounded-xl border border-outline-variant/30 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00a673] animate-pulse"></span>
              <span className="text-xs font-semibold text-on-surface-variant">Sincronizado</span>
            </div>
            <button
              id="sidebar-pin-btn"
              onClick={onTogglePinLock}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors ${
                isPinLocked
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              title={isPinLocked ? 'Sessão Bloqueada' : 'Bloquear Painel com PIN'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPinLocked ? 'lock' : 'lock_open'}
              </span>
              <span>{isPinLocked ? 'Bloqueado' : 'PIN'}</span>
            </button>
          </div>
          <div className="text-[11px] text-on-surface-variant">
            Nuvem em tempo real • Família Silva
          </div>
        </div>
      </aside>
    </>
  );
}
