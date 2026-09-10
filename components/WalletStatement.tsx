'use client';

import React, { useState } from 'react';
import { Child, PointTransaction } from '@/lib/types';

interface WalletStatementProps {
  childrenData: Child[];
  transactions: PointTransaction[];
  onAddManualAdjustment: (childId: string, points: number, reason: string) => void;
}

export default function WalletStatement({
  childrenData,
  transactions,
  onAddManualAdjustment,
}: WalletStatementProps) {
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showBonusModal, setShowBonusModal] = useState<boolean>(false);
  const [bonusChild, setBonusChild] = useState<string>('lucas');
  const [bonusAmount, setBonusAmount] = useState<number>(50);
  const [bonusReason, setBonusReason] = useState<string>('Bônus de cooperação em família');

  const filteredTx = transactions.filter((tx) => {
    const matchesChild = selectedChild === 'all' || tx.childId === selectedChild;
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesChild && matchesType;
  });

  const handleApplyBonus = () => {
    if (bonusAmount !== 0 && bonusReason.trim()) {
      onAddManualAdjustment(bonusChild, bonusAmount, bonusReason);
      setShowBonusModal(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-12 gap-6" id="view-carteira-extrato">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-primary text-white rounded-lg material-symbols-outlined text-[20px]">
              account_balance_wallet
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
              Carteira & Extrato de Pontos
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Histórico contábil completo de pontos conquistados pelas rotinas e debitados em resgates da loja.
          </p>
        </div>

        <button
          onClick={() => setShowBonusModal(true)}
          className="flex items-center gap-2 bg-[#fea619] hover:bg-[#ffb95f] text-[#2a1700] px-4 py-2.5 rounded-lg shadow-sm font-bold text-xs sm:text-sm transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Bonificar / Ajustar Saldo</span>
        </button>
      </div>

      {/* Children Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {childrenData.map((c) => (
          <div
            key={c.id}
            className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/50"
                />
                <div>
                  <h3 className="font-bold text-base text-on-surface">{c.name} ({c.age})</h3>
                  <span className="text-xs text-on-surface-variant font-medium">{c.level} • {c.streakDays} dias de sequência</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                  Saldo Líquido
                </span>
                <span className="text-2xl font-extrabold text-[#855300] dark:text-[#ffb95f]">
                  {c.balance} pts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant/20">
              <div className="bg-emerald-500/10 p-3 rounded-xl">
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 block">Total Acumulado</span>
                <span className="text-base font-bold text-emerald-900 dark:text-emerald-200">+{c.accumulated} pts</span>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-xl">
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block">Total Resgatado</span>
                <span className="text-base font-bold text-amber-900 dark:text-amber-200">-{c.spent} pts</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statement Table */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-on-surface">Extrato Consolidado da Família</h2>

          <div className="flex items-center gap-2">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface outline-none border border-outline-variant/30"
            >
              <option value="all">Todos os Filhos</option>
              <option value="lucas">Lucas</option>
              <option value="beatriz">Beatriz</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface outline-none border border-outline-variant/30"
            >
              <option value="all">Todos os Tipos</option>
              <option value="earned">Créditos (+)</option>
              <option value="spent">Resgates (-)</option>
              <option value="penalty">Penalidades</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/20 text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Data / Hora</th>
                <th className="py-2.5 px-3">Beneficiário</th>
                <th className="py-2.5 px-3">Descrição da Atividade</th>
                <th className="py-2.5 px-3">Categoria</th>
                <th className="py-2.5 px-3 text-right">Pontos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container-low/70 transition-colors">
                  <td className="py-3 px-3 text-on-surface-variant font-medium whitespace-nowrap">{tx.date}</td>
                  <td className="py-3 px-3 font-bold text-on-surface">{tx.childName}</td>
                  <td className="py-3 px-3 text-on-surface font-medium">{tx.title}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-semibold text-[10px]">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-sm whitespace-nowrap">
                    {tx.type === 'earned' ? (
                      <span className="text-emerald-700 dark:text-emerald-400">+{tx.points} pts</span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-400">-{tx.points} pts</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Bonus Modal */}
      {showBonusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[24px]">
                  monetization_on
                </span>
                <h3 className="font-bold text-base text-on-surface">Bonificar / Ajustar Pontos</h3>
              </div>
              <button
                onClick={() => setShowBonusModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Selecione o Filho
                </label>
                <select
                  value={bonusChild}
                  onChange={(e) => setBonusChild(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface outline-none border border-outline-variant/30"
                >
                  <option value="lucas">Lucas (10 anos)</option>
                  <option value="beatriz">Beatriz (7 anos)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Quantidade de Pontos (Use negativo para dedução)
                </label>
                <input
                  type="number"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-sm font-bold text-on-surface outline-none border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Motivo / Observação Pedagógica
                </label>
                <input
                  type="text"
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface outline-none border border-outline-variant/30"
                  placeholder="Ex: Iniciativa própria para ajudar na louça"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBonusModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface-variant text-xs font-bold hover:bg-surface-container cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyBonus}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold cursor-pointer"
              >
                Confirmar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
