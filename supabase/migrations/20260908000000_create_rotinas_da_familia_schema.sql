-- ==============================================================================
-- Migration: 20260908000000_create_rotinas_da_familia_schema.sql
-- Application: Rotinas da Família
-- Description: Creates family members, routine tasks, rewards, notifications,
--              and point transaction tables with RLS policies and seed data.
-- ==============================================================================

-- 1. EXTENSIONS & HELPER FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ------------------------------------------------------------------------------
-- 2. TABLE: family_members
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.family_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'child' CHECK (role IN ('child', 'parent', 'admin')),
    avatar_url TEXT,
    balance INTEGER NOT NULL DEFAULT 0,
    accumulated INTEGER NOT NULL DEFAULT 0,
    spent INTEGER NOT NULL DEFAULT 0,
    stars INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_family_members_updated_at
    BEFORE UPDATE ON public.family_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 3. TABLE: routine_tasks
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routine_tasks (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    tar_code TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Organização', 'Estudos', 'Higiene', 'Convivência', 'Saúde')),
    child_id TEXT NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    child_name TEXT NOT NULL,
    avatar TEXT,
    points INTEGER NOT NULL DEFAULT 0,
    base_points INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'pending', 'approved', 'rejected')),
    on_time BOOLEAN NOT NULL DEFAULT TRUE,
    timing_label TEXT,
    criteria TEXT,
    limit_time TEXT NOT NULL DEFAULT '20:00',
    completed_at TEXT,
    duration TEXT,
    feedback TEXT,
    has_penalty BOOLEAN NOT NULL DEFAULT FALSE,
    penalty_amount INTEGER NOT NULL DEFAULT 0,
    proof_photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routine_tasks_child_id ON public.routine_tasks(child_id);
CREATE INDEX IF NOT EXISTS idx_routine_tasks_status ON public.routine_tasks(status);
CREATE INDEX IF NOT EXISTS idx_routine_tasks_created_at ON public.routine_tasks(created_at DESC);

CREATE TRIGGER update_routine_tasks_updated_at
    BEFORE UPDATE ON public.routine_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. TABLE: reward_items
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reward_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL CHECK (cost >= 0),
    category TEXT NOT NULL DEFAULT 'Geral',
    icon TEXT DEFAULT 'redeem',
    available BOOLEAN NOT NULL DEFAULT TRUE,
    child_id TEXT NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'delivered')),
    requested_at TEXT,
    delivered_at TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reward_items_child_id ON public.reward_items(child_id);
CREATE INDEX IF NOT EXISTS idx_reward_items_status ON public.reward_items(status);

-- ------------------------------------------------------------------------------
-- 5. TABLE: notifications
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    time TEXT NOT NULL DEFAULT 'Agora',
    unread BOOLEAN NOT NULL DEFAULT TRUE,
    type TEXT NOT NULL DEFAULT 'routine' CHECK (type IN ('routine', 'reward', 'security', 'system')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(unread);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. TABLE: point_transactions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    child_name TEXT NOT NULL,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'adjusted')),
    points INTEGER NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_point_transactions_child_id ON public.point_transactions(child_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON public.point_transactions(created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- Allow read and write for anon & authenticated roles for the family routine app
CREATE POLICY "Public Read Access for Family Members"
    ON public.family_members FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Write Access for Family Members"
    ON public.family_members FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Access for Routine Tasks"
    ON public.routine_tasks FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Write Access for Routine Tasks"
    ON public.routine_tasks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Access for Reward Items"
    ON public.reward_items FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Write Access for Reward Items"
    ON public.reward_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Access for Notifications"
    ON public.notifications FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Write Access for Notifications"
    ON public.notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Access for Point Transactions"
    ON public.point_transactions FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Write Access for Point Transactions"
    ON public.point_transactions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 8. SEED INITIAL DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.family_members (id, name, role, avatar_url, balance, accumulated, spent, stars, streak_days)
VALUES
    ('lucas', 'Lucas', 'child', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtHDj_fZ4F1-SYxJp2YTb2SiQFXqzcO2IDSmTcV7xE1tFYlYR1lMFIWiXEhWRJ2PYA6SM4R1gNUcESOkjs-beJr6FhRFPtBDbuOI76eLSeV1Vzc7u9AYb78Gn6cpcihbknAHu1f1Tp3Iabp_vPmdiVVWdekArlQsvtXlWX24faQWOV1LGoQDMusiXS_WFroP9yBXZxjVRCaAc2FJygA6ysK3daGqDHhWEYDozPuCNQOOX0JE_3vada', 240, 680, 440, 18, 5),
    ('beatriz', 'Beatriz', 'child', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr_VVf0bQ-j3mZP5XUyrSDq1rSiBy4rV-g_rw66wtT0lgdHIiAx4VLl_s974LtG3LQc_uTcwuHMiiYzn4mB52Apqm9fZ4D4i_ABQWUODIN5y5KdC3XDrniW-yiW8MiIV5doBN1x2bCf-8UePB4i_R2ukZMyLU5CUUNMXP9yhtantgM_gYOIzaj7mZ4PVoxgmWsLeoxXUcQZcbJuzVEhhnYcAjrRycV-W2A9mzNikjtlWE_7OvkZdtW', 310, 520, 210, 24, 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.routine_tasks (
    id, code, tar_code, title, category, child_id, child_name, avatar, points, base_points,
    status, on_time, timing_label, criteria, limit_time, completed_at, duration, feedback,
    has_penalty, penalty_amount, proof_photo_url
) VALUES
    (
        'card-reg-1082', '#REG-1082', 'TAR-001', 'Arrumar a cama e organizar o quarto',
        'Organização', 'lucas', 'Lucas',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAtHDj_fZ4F1-SYxJp2YTb2SiQFXqzcO2IDSmTcV7xE1tFYlYR1lMFIWiXEhWRJ2PYA6SM4R1gNUcESOkjs-beJr6FhRFPtBDbuOI76eLSeV1Vzc7u9AYb78Gn6cpcihbknAHu1f1Tp3Iabp_vPmdiVVWdekArlQsvtXlWX24faQWOV1LGoQDMusiXS_WFroP9yBXZxjVRCaAc2FJygA6ysK3daGqDHhWEYDozPuCNQOOX0JE_3vada',
        50, 50, 'todo', TRUE, 'Prazo até às 20:00',
        'A cama deve estar esticada, sem brinquedos no chão e armário fechado.',
        '20:00', '', '15 min previstos', 'Aguardando execução pela criança.',
        FALSE, 0, 'https://picsum.photos/seed/quarto_organizado/800/600'
    ),
    (
        'card-reg-1083', '#REG-1083', 'TAR-004', 'Lição de casa de Matemática',
        'Estudos', 'lucas', 'Lucas',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCSd_mCBoarbq4n4bVAxQwYNzMs7asEIuBcQFh-NRQtkECZE7ccQAqKCK0F2XgkgwLVvu07FtcvQ3tJI1uV-ZwWG1FQajzOuSX7QuPnP0N79Q7a4NSLl3Vd5Z37a5q2-_qyCkustc-3BxvZh6-4nzxtVDNhkFVsIHcO7OdDLQRiUzwBSAEpWekAMkmnakXhyfdMTmrJj1FRLWPySiwWHThxmc0Q8CI95JRjU6cpLOJQdsCb5WUSRgZ9',
        70, 80, 'pending', FALSE, 'Atrasado em 25 minutos',
        'Caderno completo, exercícios da pág. 42 a 45 resolvidos a lápis com memória de cálculo.',
        '18:30', '18:55', '50 min (prev. 45 min)', 'Excelente resolução dos exercícios, mas atente-se ao horário limite!',
        TRUE, 10, 'https://picsum.photos/seed/math_homework/800/600'
    ),
    (
        'card-reg-1084', '#REG-1084', 'TAR-002', 'Escovar os dentes e lavar o rosto',
        'Higiene', 'beatriz', 'Beatriz',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBr_VVf0bQ-j3mZP5XUyrSDq1rSiBy4rV-g_rw66wtT0lgdHIiAx4VLl_s974LtG3LQc_uTcwuHMiiYzn4mB52Apqm9fZ4D4i_ABQWUODIN5y5KdC3XDrniW-yiW8MiIV5doBN1x2bCf-8UePB4i_R2ukZMyLU5CUUNMXP9yhtantgM_gYOIzaj7mZ4PVoxgmWsLeoxXUcQZcbJuzVEhhnYcAjrRycV-W2A9mzNikjtlWE_7OvkZdtW',
        30, 30, 'todo', TRUE, 'Prazo noturno: 21:00',
        'Escovação por 2 minutos, uso de fio dental e enxágue facial.',
        '21:00', '', '6 min', 'Rotina diária noturna habitual',
        FALSE, 0, 'https://picsum.photos/seed/brush_teeth/800/600'
    ),
    (
        'card-reg-1085', '#REG-1085', 'TAR-007', 'Organizar mochila para amanhã',
        'Organização', 'beatriz', 'Beatriz',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAUtf05fCv6wFbX0I5KeTZySQRXAknH_9AdPlyBcR7RqvqHn31XZRPmllS2psHxGtbNHLqrjH7TkRRirnsqlhfUuodd7etL0AWpJpnPEzInsGdqP2H3_6uDhTdo5XQ2GXmDIfMwMy2ie8uvOgroUfugpPfeIpx5HbtmchXzVR_qtwKk2YX3vOJaRG36khkt6QLai-XnZqfD3VqUwxBgmPmQH-hAnk-8tKNAWmBKEIelZpo1tn3hm6P7',
        40, 40, 'approved', TRUE, 'Realizado às 21:10 (Limite: 21:30)',
        'Estojo abastecido, livros da sexta-feira guardados e agenda assinada.',
        '21:30', '21:10', '10 min', 'Estojo abastecido, livros da sexta-feira guardados.',
        FALSE, 0, 'https://picsum.photos/seed/backpack_school/800/600'
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reward_items (id, title, description, cost, category, icon, available, child_id, status)
VALUES
    ('rew-01', '30 min de Videogame extra', 'Válido para sexta-feira ou fim de semana após lições.', 80, 'Entretenimento', 'sports_esports', TRUE, 'lucas', 'available'),
    ('rew-02', 'Escolher o Jantar de Sábado', 'Cardápio livre para a família escolher com Lucas.', 150, 'Lazer', 'restaurant', TRUE, 'lucas', 'available'),
    ('rew-03', 'Passeio de Patins no Parque', 'Ida especial ao parque no domingo com a Beatriz.', 120, 'Atividade', 'skateboarding', TRUE, 'beatriz', 'available'),
    ('rew-04', 'Sessão de Cinema com Pipoca', 'Direito a escolher o filme no streaming e pipoca doce.', 100, 'Entretenimento', 'movie', TRUE, 'beatriz', 'available')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.notifications (id, title, message, time, unread, type)
VALUES
    ('notif-1', 'Auditoria Pendente: Lição de Casa', 'Lucas concluiu a rotina de Matemática com 25min de atraso. Avalie para pontuar.', 'Há 15 min', TRUE, 'routine'),
    ('notif-2', 'Rotina Aprovada: Organizar Mochila', 'Beatriz recebeu +40 pontos por organizar o material escolar com capricho.', 'Há 1 hora', FALSE, 'routine'),
    ('notif-3', 'Novo Resgate Solicitado', 'Lucas pediu 30 min de videogame extra usando 80 pontos.', 'Há 3 horas', TRUE, 'reward')
ON CONFLICT (id) DO NOTHING;
