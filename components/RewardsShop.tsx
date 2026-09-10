'use client';

import React, { useState } from 'react';
import { RewardItem, Child } from '@/lib/types';

interface RewardsShopProps {
  rewards: RewardItem[];
  childrenData: Child[];
  onDeliverReward: (id: string) => void;
  onAddNewReward: (reward: Omit<RewardItem, 'id'>) => void;
}

export default function RewardsShop({
  rewards,
  childrenData,
  onDeliverReward,
  onAddNewReward,
}: RewardsShopProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(200);
  const [newChildId, setNewChildId] = useState('lucas');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('redeem');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const child = childrenData.find((c) => c.id === newChildId) || childrenData[0];
    onAddNewReward({
      title: newTitle,
      cost: Number(newCost),
      childId: child.id,
      childName: child.name,
      icon: newIcon,
      status: 'available',
      description: newDescription,
    });
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="flex flex-col w-full pb-12 gap-6" id="view-loja-recompensas">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-primary text-white rounded-lg material-symbols-outlined text-[20px]">
              redeem
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
              Loja Familiar de Recompensas & Prêmios
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Recompensas pedagógicas, privilégios e passeios que as crianças podem desbloquear com seus pontos.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-4 py-2.5 rounded-lg shadow-sm font-bold text-xs sm:text-sm transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nova Recompensa</span>
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rewards.map((r) => {
          const isPending = r.status === 'pending';
          const isDelivered = r.status === 'delivered';
          return (
            <div
              key={r.id}
              className={`bg-surface-container-lowest rounded-2xl p-5 shadow-xs border flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                isPending
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : 'border-outline-variant/30'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">
                      {r.icon || 'redeem'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPending
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 animate-pulse'
                        : isDelivered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    {isPending ? 'Resgate Pendente' : isDelivered ? 'Entregue' : 'Disponível'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-on-surface mt-3">{r.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {r.description || 'Recompensa especial configurada pelos pais.'}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-extrabold text-base text-[#855300] dark:text-[#ffb95f]">
                  <span className="material-symbols-outlined text-[18px] text-amber-500">toll</span>
                  <span>{r.cost} pts</span>
                </div>

                {isPending ? (
                  <button
                    onClick={() => onDeliverReward(r.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#fea619] hover:bg-[#ffb95f] text-[#2a1700] text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Entregar</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-on-surface-variant/70 font-medium">
                    {r.childName ? `Destinado a ${r.childName}` : 'Qualquer filho'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-on-surface">Cadastrar Nova Recompensa</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Título do Prêmio</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tarde no cinema com pipoca"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-medium text-on-surface outline-none border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Custo em Pontos</label>
                  <input
                    type="number"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-sm font-bold text-on-surface outline-none border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Para quem?</label>
                  <select
                    value={newChildId}
                    onChange={(e) => setNewChildId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface outline-none border border-outline-variant/30"
                  >
                    <option value="lucas">Lucas (10a)</option>
                    <option value="beatriz">Beatriz (7a)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Ícone</label>
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface outline-none border border-outline-variant/30"
                >
                  <option value="videogame_asset">Videogame</option>
                  <option value="palette">Arte / Colorir</option>
                  <option value="directions_bike">Bicicleta / Passeio</option>
                  <option value="movie">Cinema / Filme</option>
                  <option value="restaurant">Comida Especial</option>
                  <option value="redeem">Presente Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Descrição / Regras</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ex: Válido para o final de semana após todas as lições da semana concluídas."
                  className="w-full h-20 p-3 rounded-lg bg-surface-container-low text-xs text-on-surface outline-none resize-none border border-outline-variant/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface-variant text-xs font-bold hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold cursor-pointer"
                >
                  Salvar Recompensa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
