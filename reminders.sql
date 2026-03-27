-- Copie e cole este código no SQL Editor do Supabase para criar a tabela de Lembretes

CREATE TABLE public.reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
    amount NUMERIC,
    recurrence_type TEXT DEFAULT 'mensal',
    end_date DATE,
    paid_months JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Segurança)
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (Row Level Security)
CREATE POLICY "Usuários podem ver seus próprios lembretes"
    ON public.reminders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios lembretes"
    ON public.reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios lembretes"
    ON public.reminders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios lembretes"
    ON public.reminders FOR DELETE
    USING (auth.uid() = user_id);
