-- Criar tabela para notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('budget_exceeded', 'low_performance', 'opportunity', 'campaign_ended', 'low_ctr', 'high_cpc')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para configurações de alertas
CREATE TABLE public.alert_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('budget_exceeded', 'low_performance', 'opportunity', 'low_ctr', 'high_cpc')),
  threshold_value NUMERIC,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT false,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, type)
);

-- Criar tabela para relatórios automáticos
CREATE TABLE public.automated_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly', 'custom')),
  email_recipients TEXT[],
  schedule_day INTEGER, -- 1-7 para semanal, 1-31 para mensal
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para metas e orçamentos
CREATE TABLE public.budget_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  monthly_budget NUMERIC NOT NULL,
  target_cpc NUMERIC,
  target_ctr NUMERIC,
  target_roas NUMERIC,
  target_conversions INTEGER,
  month_year TEXT NOT NULL, -- formato: "2024-01"
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, campaign_id, month_year)
);

-- Criar tabela para automações
CREATE TABLE public.automation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pause_low_roi', 'adjust_budget', 'optimize_keywords', 'bid_adjustment')),
  condition_type TEXT NOT NULL CHECK (condition_type IN ('ctr_below', 'cpc_above', 'roi_below', 'budget_exceeded')),
  condition_value NUMERIC NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('pause', 'increase_budget', 'decrease_budget', 'adjust_bid')),
  action_value NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  campaigns UUID[], -- Array de IDs de campanhas
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para colaboração (multi-usuário)
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  member_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(owner_id, member_id)
);

-- Criar tabela para histórico de alterações
CREATE TABLE public.change_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para comentários
CREATE TABLE public.campaign_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_comments ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas RLS para alert_settings
CREATE POLICY "Users can view their own alert settings" ON public.alert_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alert settings" ON public.alert_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alert settings" ON public.alert_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alert settings" ON public.alert_settings FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas RLS para automated_reports
CREATE POLICY "Users can view their own automated reports" ON public.automated_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own automated reports" ON public.automated_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own automated reports" ON public.automated_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own automated reports" ON public.automated_reports FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas RLS para budget_goals
CREATE POLICY "Users can view their own budget goals" ON public.budget_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own budget goals" ON public.budget_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budget goals" ON public.budget_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budget goals" ON public.budget_goals FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas RLS para automation_rules
CREATE POLICY "Users can view their own automation rules" ON public.automation_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own automation rules" ON public.automation_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own automation rules" ON public.automation_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own automation rules" ON public.automation_rules FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas RLS para team_members
CREATE POLICY "Users can view teams they own or are members of" ON public.team_members FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = member_id);
CREATE POLICY "Users can create team invitations" ON public.team_members FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update teams they own" ON public.team_members FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete teams they own" ON public.team_members FOR DELETE USING (auth.uid() = owner_id);

-- Criar políticas RLS para change_history
CREATE POLICY "Users can view change history for their campaigns" ON public.change_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create change history" ON public.change_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Criar políticas RLS para campaign_comments
CREATE POLICY "Users can view comments on their campaigns" ON public.campaign_comments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create comments on their campaigns" ON public.campaign_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.campaign_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.campaign_comments FOR DELETE USING (auth.uid() = user_id);

-- Criar triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alert_settings_updated_at BEFORE UPDATE ON public.alert_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_automated_reports_updated_at BEFORE UPDATE ON public.automated_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budget_goals_updated_at BEFORE UPDATE ON public.budget_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON public.automation_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_campaign_comments_updated_at BEFORE UPDATE ON public.campaign_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir configurações padrão de alertas
INSERT INTO public.alert_settings (user_id, type, threshold_value, is_enabled, email_enabled, push_enabled)
SELECT 
  id,
  'budget_exceeded',
  90.0,
  true,
  false,
  true
FROM auth.users
ON CONFLICT (user_id, type) DO NOTHING;

INSERT INTO public.alert_settings (user_id, type, threshold_value, is_enabled, email_enabled, push_enabled)
SELECT 
  id,
  'low_ctr',
  1.0,
  true,
  false,
  true
FROM auth.users
ON CONFLICT (user_id, type) DO NOTHING;

INSERT INTO public.alert_settings (user_id, type, threshold_value, is_enabled, email_enabled, push_enabled)
SELECT 
  id,
  'high_cpc',
  5.0,
  true,
  false,
  true
FROM auth.users
ON CONFLICT (user_id, type) DO NOTHING;