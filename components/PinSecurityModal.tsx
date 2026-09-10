'use client';

import React, { useState } from 'react';

interface PinSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctPin: string;
  onSuccessUnlock: () => void;
  mode?: 'unlock' | 'change';
  onUpdatePin?: (newPin: string) => void;
}

export default function PinSecurityModal({
  isOpen,
  onClose,
  correctPin,
  onSuccessUnlock,
  mode = 'unlock',
  onUpdatePin,
}: PinSecurityModalProps) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      setErrorMsg('');

      if (next.length === 4) {
        if (mode === 'unlock') {
          if (next === correctPin) {
            onSuccessUnlock();
            setPin('');
            onClose();
          } else {
            setErrorMsg('Código PIN incorreto. Tente novamente.');
            setTimeout(() => setPin(''), 600);
          }
        } else if (mode === 'change') {
          if (onUpdatePin) {
            onUpdatePin(next);
          }
          setPin('');
          onClose();
        }
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#081534] text-white flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[28px]">lock</span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {mode === 'unlock' ? 'Desbloquear Acesso dos Pais' : 'Definir Novo PIN'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'unlock'
              ? 'Digite o PIN de 4 dígitos para autorizar alterações no painel.'
              : 'Digite os novos 4 dígitos para segurança de sua família.'}
          </p>
        </div>

        {/* PIN indicator dots */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i <= pin.length
                  ? 'bg-amber-500 scale-110 shadow-xs'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs text-red-600 font-semibold animate-shake">{errorMsg}</p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-lg font-bold text-slate-800 flex items-center justify-center transition-colors active:scale-95 select-none"
            >
              {d}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-12 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-600 flex items-center justify-center transition-colors active:scale-95 select-none"
          >
            Limpar
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-lg font-bold text-slate-800 flex items-center justify-center transition-colors active:scale-95 select-none"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors active:scale-95 select-none"
          >
            <span className="material-symbols-outlined text-[20px]">backspace</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold py-1 px-3"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
