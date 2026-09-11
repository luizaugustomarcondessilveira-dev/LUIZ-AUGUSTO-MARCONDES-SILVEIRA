'use client';

import React, { useState } from 'react';
import { RoutineTask, Child } from '@/lib/types';

interface ActivitiesCatalogProps {
  tasks: RoutineTask[];
  childrenData?: Child[];
  categories?: string[];
  onOpenNewActivity: () => void;
  onOpenManageCategories?: () => void;
  onFilterChild: (childId: string) => void;
  selectedChildFilter: string;
  onEditTask?: (task: RoutineTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

export default function ActivitiesCatalog({
  tasks,
  childrenData = [],
  categories = ['Organização', 'Estudos', 'Higiene', 'Convivência', 'Saúde'],
  onOpenNewActivity,
  onOpenManageCategories,
  selectedChildFilter,
  onFilterChild,
  onEditTask,
  onDeleteTask,
}: ActivitiesCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((t) => {
    const matchesChild = selectedChildFilter === 'all' || t.childId === selectedChildFilter;
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tarCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChild && matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-12 gap-6" id="view-catalogo-atividades">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-primary text-white rounded-lg material-symbols-outlined text-[20px]">
              checklist
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
              Catálogo Geral de Atividades & Rotinas
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Padronize os critérios de aceite, valores em pontos e horários limite para cada tarefa familiar. Todas as atividades são editáveis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {onOpenManageCategories && (
            <button
              type="button"
              onClick={onOpenManageCategories}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">category</span>
              <span>Categorias</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenNewActivity}
            className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-lg shadow-sm font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Cadastrar Nova Rotina</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant/60 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nome, código #REG ou TAR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Child Selector */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedChildFilter}
            onChange={(e) => onFilterChild(e.target.value)}
            className="h-10 px-3 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30 outline-none cursor-pointer"
          >
            <option value="all">Todos os Filhos</option>
            {childrenData.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Routine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
            <span className="material-symbols-outlined text-[44px] text-on-surface-variant/40 mb-2">
              assignment_late
            </span>
            <h3 className="font-bold text-base text-on-surface">Nenhuma atividade encontrada</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Tente alterar os filtros de busca ou cadastre uma nova rotina.
            </p>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-outline-variant/30 flex flex-col justify-between gap-3 hover:border-outline-variant/60 transition-all group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant text-[11px] font-bold">
                      {t.tarCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed text-[11px] font-bold">
                      {t.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm font-extrabold text-[#855300] dark:text-[#ffb95f] bg-amber-500/10 px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[16px] text-amber-500">toll</span>
                      <span>+{t.basePoints} pts</span>
                    </div>

                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-1">
                      {onEditTask && (
                        <button
                          type="button"
                          onClick={() => onEditTask(t)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                          title="Editar Atividade"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}

                      {onDeleteTask && (
                        <div>
                          {deletingTaskId === t.id ? (
                            <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 p-1 rounded-lg">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteTask(t.id);
                                  setDeletingTaskId(null);
                                }}
                                className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 cursor-pointer"
                              >
                                Excluir
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingTaskId(null)}
                                className="p-0.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingTaskId(t.id)}
                              className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Excluir Atividade"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-base text-on-surface mt-2">{t.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1 italic leading-relaxed">
                  &ldquo;{t.criteria}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <img
                    src={t.avatar}
                    alt={t.childName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-medium">Responsável: <strong className="text-on-surface">{t.childName}</strong></span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>Limite: {t.limitTime}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
