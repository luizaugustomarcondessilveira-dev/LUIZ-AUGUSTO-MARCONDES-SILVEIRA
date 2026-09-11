'use client';

import React, { useState } from 'react';
import { Child, ParentProfile, FamilyAuthUser } from '@/lib/types';
import { PARENT_USER } from '@/lib/initial-data';
import EditMemberModal from '@/components/EditMemberModal';
import EditFamilyNameModal from '@/components/EditFamilyNameModal';

interface FamilyMembersProps {
  childrenData: Child[];
  onOpenChildMode: (childId: string) => void;
  parentProfile?: ParentProfile;
  currentUser?: FamilyAuthUser | null;
  onNavigateToSettings?: () => void;
  onOpenSettings?: () => void;
  onOpenAuthModal?: () => void;
  onUpdateChildName?: (childId: string, newName: string) => void;
  onSaveMember?: (memberData: any) => void;
  onDeleteMember?: (memberId: string) => void;
  onSaveFamilyName?: (newName: string) => void;
}

export default function FamilyMembers({
  childrenData,
  onOpenChildMode,
  parentProfile = {
    fatherName: 'Pai Admin',
    motherName: 'Mãe Admin',
    familyName: 'Família Silva',
    email: 'luizaugustomarcondessilveira@gmail.com',
    role: 'Administrador Chefe',
  },
  currentUser,
  onNavigateToSettings,
  onOpenSettings,
  onOpenAuthModal,
  onSaveMember,
  onDeleteMember,
  onSaveFamilyName,
}: FamilyMembersProps) {
  const [editingMember, setEditingMember] = useState<Partial<Child> | null>(null);
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [parentType, setParentType] = useState<'father' | 'mother'>('father');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFamilyNameModal, setShowFamilyNameModal] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const handleEditFather = () => {
    setEditingMember({
      id: 'pai',
      name: parentProfile.fatherName || PARENT_USER.name,
      avatar: (parentProfile as any).fatherAvatar || PARENT_USER.avatar,
      role: 'parent',
      email: currentUser?.role === 'parent' ? currentUser.email : parentProfile.email || PARENT_USER.email,
    } as any);
    setIsEditingParent(true);
    setParentType('father');
    setIsModalOpen(true);
  };

  const handleEditMother = () => {
    setEditingMember({
      id: 'mae',
      name: parentProfile.motherName || 'Mãe Admin',
      avatar: (parentProfile as any).motherAvatar || 'https://picsum.photos/seed/mother_admin/200/200',
      role: 'parent',
      email: 'mae.familia@familia.com',
    } as any);
    setIsEditingParent(true);
    setParentType('mother');
    setIsModalOpen(true);
  };

  const handleEditChild = (child: Child) => {
    setEditingMember(child);
    setIsEditingParent(false);
    setIsModalOpen(true);
  };

  const handleAddNewMember = () => {
    setEditingMember(null);
    setIsEditingParent(false);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full pb-12 gap-6" id="view-membros-familia">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 bg-primary text-white rounded-lg material-symbols-outlined text-[20px]">
              groups
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
              Membros da {parentProfile.familyName || 'Família Silva'}
            </h1>
            <button
              type="button"
              onClick={() => setShowFamilyNameModal(true)}
              title="Alterar nome da família"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Edição completa de perfis (nomes, fotos de perfil e dados), sincronizados no banco Supabase em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">vpn_key</span>
              <span>{currentUser ? 'Gerenciar Conta' : 'Login / Cadastro'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddNewMember}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Adicionar Membro</span>
          </button>
        </div>
      </div>

      {/* Parents Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">shield_person</span>
            <span>Administradores dos Pais (Perfis Editáveis)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Father */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative group shrink-0">
                <img
                  src={(parentProfile as any).fatherAvatar || PARENT_USER.avatar}
                  alt={parentProfile.fatherName || PARENT_USER.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30"
                />
                <button
                  type="button"
                  onClick={handleEditFather}
                  className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Trocar Foto"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-on-surface truncate">
                    {parentProfile.fatherName || PARENT_USER.name}
                  </h3>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary dark:text-primary-fixed px-2 py-0.5 rounded-full">
                    Pai / Admin
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant truncate">
                  {currentUser?.role === 'parent' ? currentUser.email : parentProfile.email || PARENT_USER.email}
                </p>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  <span>PIN Seguro • Acesso Total</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEditFather}
              className="p-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              title="Editar Perfil do Pai"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span className="hidden sm:inline">Editar</span>
            </button>
          </div>

          {/* Mother */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative group shrink-0">
                <img
                  src={(parentProfile as any).motherAvatar || 'https://picsum.photos/seed/mother_admin/200/200'}
                  alt={parentProfile.motherName || 'Mãe Admin'}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-400/40"
                />
                <button
                  type="button"
                  onClick={handleEditMother}
                  className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Trocar Foto"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-on-surface truncate">
                    {parentProfile.motherName || 'Mãe Admin'}
                  </h3>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    Mãe / Co-Admin
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant truncate">mae.familia@familia.com</p>
                <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">sync</span>
                  <span>Acesso compartilhado</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEditMother}
              className="p-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              title="Editar Perfil da Mãe"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span className="hidden sm:inline">Editar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Children Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[18px]">child_care</span>
            <span>Filhos Cadastrados ({childrenData.length})</span>
          </h2>

          <button
            type="button"
            onClick={handleAddNewMember}
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Adicionar outro filho</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {childrenData.map((c) => (
            <div
              key={c.id}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col justify-between gap-5 relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleEditChild(c)}
                      className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Trocar Foto"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </button>
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#00a673] text-white text-xs font-bold ring-2 ring-surface-container-lowest">
                      {c.badgeNumber || 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-on-surface truncate">{c.name}</h3>
                    <p className="text-xs text-on-surface-variant font-medium">{c.age} • {c.level}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        🔥 {c.streakDays || 0} dias de sequência
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
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
                  <span className="font-bold text-on-surface">{c.weekPercent ?? 85}%</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Acumulados</span>
                  <span className="font-bold text-on-surface">{c.accumulated ?? c.balance}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Resgatados</span>
                  <span className="font-bold text-on-surface">{c.spent ?? 0}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEditChild(c)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Editar Perfil</span>
                  </button>

                  {onDeleteMember && childrenData.length > 1 && (
                    <div>
                      {deletingMemberId === c.id ? (
                        <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteMember(c.id);
                              setDeletingMemberId(null);
                            }}
                            className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 cursor-pointer"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingMemberId(null)}
                            className="p-0.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">close</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeletingMemberId(c.id)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Excluir este filho"
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
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

      {/* Edit Member Modal */}
      {isModalOpen && (
        <EditMemberModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={editingMember}
          isParent={isEditingParent}
          parentType={parentType}
          onSaveMember={(data) => {
            if (onSaveMember) onSaveMember(data);
            setIsModalOpen(false);
          }}
          onDeleteMember={onDeleteMember ? (id) => {
            onDeleteMember(id);
            setIsModalOpen(false);
          } : undefined}
        />
      )}

      {/* Edit Family Name Modal */}
      {showFamilyNameModal && (
        <EditFamilyNameModal
          isOpen={showFamilyNameModal}
          onClose={() => setShowFamilyNameModal(false)}
          currentFamilyName={parentProfile.familyName || 'Família Silva'}
          onSaveFamilyName={(newName) => {
            if (onSaveFamilyName) onSaveFamilyName(newName);
            setShowFamilyNameModal(false);
          }}
        />
      )}
    </div>
  );
}
