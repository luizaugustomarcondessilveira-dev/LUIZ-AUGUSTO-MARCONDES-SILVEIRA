'use client';

import React from 'react';
import { Child } from '@/lib/types';
import { PARENT_USER } from '@/lib/initial-data';

interface FamilyMembersProps {
  childrenData: Child[];
  onOpenChildMode: (childId: string) => void;
}

export default function FamilyMembers({
  childrenData,
  onOpenChildMode,
}: FamilyMembersProps) {
  return (
    <div className="flex flex-col w-full pb-12 gap-6" id="view-membros-familia">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-primary text-white rounded-lg material-symbols-outlined text-[20px]">
            groups
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
            Membros da Família Silva
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Configuração de permissões, perfis das crianças, níveis gamificados e acesso em modo filho.
        </p>
      </div>

      {/* Parents Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
          Administradores dos Pais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Father */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={PARENT_USER.avatar}
                alt={PARENT_USER.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-on-surface">{PARENT_USER.name}</h3>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary dark:text-primary-fixed px-2 py-0.5 rounded-full">
                    Admin Chefe
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">{PARENT_USER.email}</p>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  <span>PIN Seguro Ativo</span>
                </span>
              </div>
            </div>
          </div>

          {/* Mother */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://picsum.photos/seed/mother_admin/200/200"
                alt="Mãe Admin"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-on-surface">Mãe Admin</h3>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    Co-Admin
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">mae.familia@exemplo.com</p>
                <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">sync</span>
                  <span>Acesso compartilhado</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Children Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
          Filhos Cadastrados & Modos de Visualização
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {childrenData.map((c) => (
            <div
              key={c.id}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col justify-between gap-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#00a673] text-white text-xs font-bold ring-2 ring-surface-container-lowest">
                      {c.badgeNumber}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-on-surface">{c.name}</h3>
                    <p className="text-xs text-on-surface-variant font-medium">{c.age} • {c.level}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        🔥 {c.streakDays} dias de sequência
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-on-surface-variant uppercase font-bold block">
                    Saldo Atual
                  </span>
                  <span className="text-xl font-extrabold text-[#855300] dark:text-[#ffb95f]">{c.balance} pts</span>
                </div>
              </div>

              {/* Stats box */}
              <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-3 rounded-xl text-center text-xs">
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Semana</span>
                  <span className="font-bold text-on-surface">{c.weekPercent}%</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Acumulados</span>
                  <span className="font-bold text-on-surface">{c.accumulated}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Resgatados</span>
                  <span className="font-bold text-on-surface">{c.spent}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Visualizar painel infantil:</span>
                <button
                  onClick={() => onOpenChildMode(c.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#fea619] hover:bg-[#ffb95f] text-[#2a1700] font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">child_care</span>
                  <span>Abrir Modo {c.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
