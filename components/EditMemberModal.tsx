'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Child } from '@/lib/types';
import { uploadProfilePhoto } from '@/lib/supabase';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Partial<Child> | null;
  isParent?: boolean;
  parentType?: 'father' | 'mother';
  onSaveMember: (memberData: {
    id: string;
    name: string;
    avatar: string;
    age?: string;
    level?: string;
    balance?: number;
    role?: 'child' | 'parent';
    email?: string;
  }) => void;
  onDeleteMember?: (memberId: string) => void;
}

const PRESET_AVATARS = [
  { id: 'kid-1', label: 'Lucas (Garoto)', url: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80' },
  { id: 'kid-2', label: 'Beatriz (Garota)', url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80' },
  { id: 'kid-3', label: 'Criança Divertida', url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&auto=format&fit=crop&q=80' },
  { id: 'kid-4', label: 'Estudante', url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=150&auto=format&fit=crop&q=80' },
  { id: 'parent-1', label: 'Pai Admin', url: 'https://picsum.photos/seed/luiz_silva_avatar/200/200' },
  { id: 'parent-2', label: 'Mãe Admin', url: 'https://picsum.photos/seed/mother_admin/200/200' },
];

export default function EditMemberModal({
  isOpen,
  onClose,
  member,
  isParent = false,
  parentType = 'father',
  onSaveMember,
  onDeleteMember,
}: EditMemberModalProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState('');
  const [balance, setBalance] = useState(0);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'child' | 'parent'>('child');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setAvatar(member.avatar || '');
      setAge(member.age || (isParent ? 'Adulto' : '8 anos'));
      setLevel(member.level || (isParent ? 'Administrador' : 'Nível 1 - Iniciante'));
      setBalance(member.balance ?? 0);
      setRole(isParent ? 'parent' : (member.role || 'child'));
      setEmail((member as any).email || '');
    } else {
      setName('');
      setAvatar(PRESET_AVATARS[0].url);
      setAge(isParent ? 'Adulto' : '9 anos');
      setLevel(isParent ? 'Administrador' : 'Nível 1 - Explorador');
      setBalance(100);
      setRole(isParent ? 'parent' : 'child');
      setEmail('');
    }
    setShowConfirmDelete(false);
  }, [member, isOpen, isParent]);

  if (!isOpen) return null;

  const isNew = !member || !member.id;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 8MB.');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const prefix = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'member';
      const uploadedUrl = await uploadProfilePhoto(file, prefix);
      if (uploadedUrl) {
        setAvatar(uploadedUrl);
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = member?.id || (role === 'parent' ? (parentType === 'mother' ? 'mae' : 'pai') : `child-${Date.now()}`);

    onSaveMember({
      id,
      name: name.trim(),
      avatar: avatar || 'https://picsum.photos/seed/default_member/200/200',
      age: isParent ? 'Adulto' : age,
      level: isParent ? 'Administrador' : level,
      balance: Number(balance),
      role,
      email: email.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed material-symbols-outlined text-[22px]">
              {isNew ? 'person_add' : 'badge'}
            </span>
            <div>
              <h3 className="font-bold text-base text-on-surface">
                {isNew
                  ? 'Adicionar Novo Membro da Família'
                  : `Editar Perfil de ${member?.name || 'Membro'}`}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Altere nome, foto de perfil e dados cadastrais no Supabase
              </p>
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
          {/* Avatar Section with Upload & Presets */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
            <label className="block text-xs font-bold text-on-surface">
              Foto de Perfil do Membro
            </label>

            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={avatar || 'https://picsum.photos/seed/default_member/200/200'}
                  alt={name || 'Avatar'}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-primary shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Trocar Foto"
                >
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </button>
              </div>

              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Enviando foto...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        <span>Fazer Upload de Foto</span>
                      </>
                    )}
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('https://picsum.photos/seed/default_member/200/200')}
                      className="px-2.5 py-1.5 text-xs text-on-surface-variant hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Remover Foto
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Formatos aceitos: JPG, PNG, WebP (até 8MB). Salva no Supabase e sincroniza em tempo real.
                </p>
              </div>
            </div>

            {/* Avatar Presets Selection */}
            <div>
              <span className="block text-[11px] font-bold text-on-surface-variant mb-1.5">
                Ou escolha uma foto rápida da galeria:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {PRESET_AVATARS.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setAvatar(p.url)}
                    className={`relative rounded-full p-0.5 border-2 transition-all shrink-0 cursor-pointer ${
                      avatar === p.url ? 'border-primary scale-105 ring-2 ring-primary/30' : 'border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <img
                      src={p.url}
                      alt={p.label}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Nome Completo do Membro *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lucas Silva, Mariana Silva..."
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-sm font-semibold text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-colors"
            />
          </div>

          {/* Papel / Função */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Papel na Família
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 outline-none cursor-pointer"
              >
                <option value="child">Filho(a) / Criança</option>
                <option value="parent">Pai / Responsável</option>
              </select>
            </div>

            {role === 'child' ? (
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Idade
                </label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ex: 10 anos"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Email de Contato
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@familia.com"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                />
              </div>
            )}
          </div>

          {role === 'child' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Nível / Título Pedagógico
                </label>
                <input
                  type="text"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder="Ex: Nível 3 - Guardião da Casa"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Saldo de Pontos (pts)
                </label>
                <input
                  type="number"
                  min="0"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-3">
            {!isNew && onDeleteMember && member?.id && (
              <div>
                {showConfirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteMember(member.id!);
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
                    <span>Excluir Membro</span>
                  </button>
                )}
              </div>
            )}

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
                <span>Salvar Membro</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
