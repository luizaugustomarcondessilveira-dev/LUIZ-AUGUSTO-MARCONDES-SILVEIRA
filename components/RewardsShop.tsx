'use client';

import React, { useState } from 'react';
import { RewardItem, Child } from '@/lib/types';
import EditRewardModal from '@/components/EditRewardModal';

interface RewardsShopProps {
  rewards: RewardItem[];
  childrenData: Child[];
  onDeliverReward: (id: string) => void;
  onAddNewReward: (reward: Omit<RewardItem, 'id'>) => void;
  onEditReward?: (reward: RewardItem) => void;
  onDeleteReward?: (rewardId: string) => void;
}

const REWARD_ICONS = [
  { icon: 'redeem', label: 'Presente' },
  { icon: 'sports_esports', label: 'Videogame' },
  { icon: 'movie', label: 'Cinema / Filme' },
  { icon: 'local_pizza', label: 'Pizza / Lanche' },
  { icon: 'icecream', label: 'Sorvete' },
  { icon: 'directions_bike', label: 'Passeio / Parque' },
  { icon: 'menu_book', label: 'Livro' },
  { icon: 'toys', label: 'Brinquedo' },
  { icon: 'celebration', label: 'Festa / Privilégio' },
  { icon: 'palette', label: 'Arte / Pintura' },
  { icon: 'hotel', label: 'Dormir mais tarde' },
  { icon: 'star', label: 'Especial' },
];

export default function RewardsShop({
  rewards,
  childrenData,
  onDeliverReward,
  onAddNewReward,
  onEditReward,
  onDeleteReward,
}: RewardsShopProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReward, setEditingReward] = useState<RewardItem | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(200);
  const [newChildId, setNewChildId] = useState('all');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('redeem');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const child = childrenData.find((c) => c.id === newChildId);
    onAddNewReward({
      title: newTitle.trim(),
      cost: Number(newCost),
      childId: child ? child.id : 'all',
      childName: child ? child.name : 'Qualquer filho',
      icon: newIcon,
      status: 'available',
      description: newDescription.trim(),
    });
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewCost(200);
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
            Recompensas pedagógicas, privilégios e passeios que as crianças podem desbloquear com seus pontos. Todas editáveis e sincronizadas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-4 py-2.5 rounded-lg shadow-sm font-bold text-xs sm:text-sm transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nova Recompensa</span>
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rewards.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
            <span className="material-symbols-outlined text-[44px] text-on-surface-variant/40 mb-2">
              featured_seasonal_and_gifts
            </span>
            <h3 className="font-bold text-base text-on-surface">Nenhuma recompensa cadastrada</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Cadastre presentes, passeios ou privilégios para motivar as crianças.
            </p>
          </div>
        ) : (
          rewards.map((r) => {
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
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[28px]">
                        {r.icon || 'redeem'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
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

                      {/* Quick Edit & Delete */}
                      <button
                        type="button"
                        onClick={() => setEditingReward(r)}
                        className="p-1 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                        title="Editar Recompensa"
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>

                      {onDeleteReward && (
                        <div>
                          {deletingId === r.id ? (
                            <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 p-0.5 rounded-lg">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteReward(r.id);
                                  setDeletingId(null);
                                }}
                                className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                              >
                                Sim
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="p-0.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[12px]">close</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingId(r.id)}
                              className="p-1 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Excluir Recompensa"
                            >
                              <span className="material-symbols-outlined text-[17px]">delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
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
                      type="button"
                      onClick={() => onDeliverReward(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#fea619] hover:bg-[#ffb95f] text-[#2a1700] text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Entregar</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-on-surface-variant/70 font-medium">
                      {r.childName && r.childName !== 'Qualquer filho' ? `Para ${r.childName}` : 'Qualquer filho'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Reward Modal */}
      {editingReward && (
        <EditRewardModal
          isOpen={Boolean(editingReward)}
          onClose={() => setEditingReward(null)}
          reward={editingReward}
          childrenData={childrenData}
          onSaveReward={(updated) => {
            if (onEditReward) onEditReward(updated);
            setEditingReward(null);
          }}
          onDeleteReward={(id) => {
            if (onDeleteReward) onDeleteReward(id);
            setEditingReward(null);
          }}
        />
      )}

      {/* Add Reward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-outline-variant/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-primary text-on-primary material-symbols-outlined text-[20px]">
                  card_giftcard
                </span>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Nova Recompensa Familiar</h3>
                  <p className="text-xs text-on-surface-variant">Cadastre um prêmio ou privilégio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Título do Prêmio *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Sessão de Videogame Extra"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-medium text-on-surface outline-none border border-outline-variant/30 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Custo (Pontos)
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    step={10}
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-sm font-bold text-on-surface outline-none border border-outline-variant/30 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Destinado a
                  </label>
                  <select
                    value={newChildId}
                    onChange={(e) => setNewChildId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface outline-none border border-outline-variant/30 cursor-pointer"
                  >
                    <option value="all">Qualquer Filho</option>
                    {childrenData.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Ícone Representativo
                </label>
                <div className="grid grid-cols-6 gap-2 p-2 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  {REWARD_ICONS.map((item) => (
                    <button
                      type="button"
                      key={item.icon}
                      onClick={() => setNewIcon(item.icon)}
                      title={item.label}
                      className={`h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        newIcon === item.icon
                          ? 'bg-amber-500 text-white shadow-xs scale-105'
                          : 'hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Descrição / Regras
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ex: Válido na sexta-feira à noite após cumprir a rotina escolar."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface outline-none border border-outline-variant/30 focus:border-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
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
