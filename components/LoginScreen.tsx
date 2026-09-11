'use client';

import React, { useState } from 'react';
import { Child, ParentProfile } from '@/lib/types';

interface LoginScreenProps {
  childrenData: Child[];
  parentProfile: ParentProfile;
  onLogin: (role: 'parent' | 'child', childId?: string) => void;
  themeMode: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export default function LoginScreen({
  childrenData,
  parentProfile,
  onLogin,
  themeMode,
  onThemeChange,
}: LoginScreenProps) {
  const [step, setStep] = useState<'choose' | 'child-select'>('choose');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081534] via-[#0f2040] to-[#003220] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorações de fundo */}
      <div className="absolute top-[-10%] left-[-5%] w-80 h-80 rounded-full bg-[#fea619]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full bg-[#6ffbbe]/10 blur-3xl pointer-events-none" />

      {/* Botão de tema */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => onThemeChange(themeMode === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          title="Alternar tema"
        >
          <span className="material-symbols-outlined text-[20px]">
            {themeMode === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>

      {/* Card principal */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col items-center gap-6">
        {/* Logo / Título */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#fea619] flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[#2a1700] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              family_restroom
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Rotinas da Família
          </h1>
          <p className="text-sm text-[#bac5ee]">
            {parentProfile.familyName || 'Família Silva'}
          </p>
        </div>

        {step === 'choose' ? (
          <>
            <p className="text-xs text-[#8691b7] text-center">
              Selecione seu perfil para entrar
            </p>

            <div className="w-full flex flex-col gap-3">
              {/* Botão Pai */}
              <button
                onClick={() => onLogin('parent')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#fea619] hover:bg-[#ffb95f] text-[#2a1700] font-bold transition-all active:scale-95 shadow-lg group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2a1700]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shield_person
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-extrabold">Responsável / Pai</div>
                  <div className="text-[11px] opacity-70 font-medium">
                    {parentProfile.fatherName} · {parentProfile.motherName}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] ml-auto opacity-60 group-hover:opacity-100">
                  arrow_forward
                </span>
              </button>

              {/* Botão Filho */}
              <button
                onClick={() => {
                  if (childrenData.length === 1) {
                    onLogin('child', childrenData[0].id);
                  } else {
                    setStep('child-select');
                  }
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all active:scale-95 border border-white/10 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#6ffbbe]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#6ffbbe] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    child_care
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-extrabold">Sou um Filho</div>
                  <div className="text-[11px] text-[#bac5ee] font-medium">
                    {childrenData.map((c) => c.name).join(' · ')}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] ml-auto opacity-60 group-hover:opacity-100">
                  arrow_forward
                </span>
              </button>
            </div>

            <p className="text-[10px] text-[#8691b7] text-center mt-2">
              Sistema de rotinas e recompensas familiares
            </p>
          </>
        ) : (
          <>
            <div className="w-full">
              <button
                onClick={() => setStep('choose')}
                className="flex items-center gap-1 text-[#bac5ee] text-xs hover:text-white transition-colors mb-4"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Voltar</span>
              </button>

              <p className="text-sm text-white font-bold mb-3 text-center">
                Quem está entrando?
              </p>

              <div className="flex flex-col gap-3">
                {childrenData.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onLogin('child', child.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all active:scale-95 border border-white/10 group"
                  >
                    <img
                      src={child.avatar}
                      alt={child.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#fea619]/50 shrink-0"
                    />
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-sm font-extrabold">{child.name}</div>
                      <div className="text-[11px] text-[#bac5ee] font-medium">
                        {child.age} · {child.level} · {child.balance} pts
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-[#6ffbbe] font-bold bg-[#6ffbbe]/10 px-2 py-0.5 rounded-full">
                        🔥 {child.streakDays}d
                      </span>
                      <span className="material-symbols-outlined text-[20px] opacity-60 group-hover:opacity-100">
                        arrow_forward
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

