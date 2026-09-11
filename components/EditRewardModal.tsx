'use client';

import React, { useState, useEffect } from 'react';
import { RewardItem, Child } from '@/lib/types';

interface EditRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: RewardItem | null;
  childrenData: Child[];
  onSaveReward: (reward: RewardItem) => void;
  onDeleteReward: (rewardId: string) => void;
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

function EditRewardDialog({
  onClose,
  reward,
  childrenData,
  onSaveReward,
  onDeleteReward,
}: Omit<EditRewardModalProps, 'isOpen'> & { reward: RewardItem }) {
  const [title, setTitle] = useState(reward.title || '');
  const [cost, setCost] = useState(reward.cost || 200);
  const [childId, setChildId] = useState(reward.childId || 'all');
  const [icon, setIcon] = useState(reward.icon || 'redeem');
  const [description, setDescription] = useState(reward.description || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const child = childrenData.find((c) => c.id === childId);

    const updatedReward: RewardItem = {
      ...reward,
      title: title.trim(),
      cost: Number(cost),
      childId: child ? child.id : 'all',
      childName: child ? child.name : 'Qualquer filho',
      icon,
      description: description.trim(),
    };

    onSaveReward(updatedReward);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 material-symbols-outlined text-[22px]">
              card_giftcard
            </span>
            <div>
              <h3 className="font-bold text-base text-on-surface">Editar Recompensa</h3>
              <p className="text-xs text-on-surface-variant">Altere valores, regras ou exclua do catálogo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Título da Recompensa *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Noite da Pizza com Escolha do Sabor"
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-sm font-semibold text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Custo em Pontos (pts)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Destinado a
              </label>
              <select
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 outline-none cursor-pointer"
              >
                <option value="all">Qualquer Filho (Geral)</option>
                {childrenData.map((c) => (
                  <option key={c.id} value={c.id}>
                    Apenas {c.name}
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
                  onClick={() => setIcon(item.icon)}
                  title={item.label}
                  className={`h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    icon === item.icon
                      ? 'bg-amber-500 text-white shadow-xs scale-105'
                      : 'hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Descrição / Regras de Concessão
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Válido aos finais de semana após auditoria completa."
              className="w-full p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-3">
            <div>
              {showConfirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteReward(reward.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Confirmar Exclusão
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-2 py-1.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Excluir Recompensa</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Salvar Recompensa</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditRewardModal(props: EditRewardModalProps) {
  if (!props.isOpen || !props.reward) return null;
  return <EditRewardDialog {...props} reward={props.reward} />;
}
