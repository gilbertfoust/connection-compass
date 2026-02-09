
-- Budget table for monthly budgets per couple
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2100),
  template TEXT NOT NULL DEFAULT 'standard',
  total_income NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(couple_id, month, year)
);

-- Budget items (line items within a budget)
CREATE TABLE public.budget_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  couple_id UUID NOT NULL REFERENCES public.couples(id),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  planned_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  actual_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'expense',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for budgets
CREATE POLICY "Users can view couple budgets"
ON public.budgets FOR SELECT
USING (couple_id = get_user_couple_id(auth.uid()));

CREATE POLICY "Users can insert couple budgets"
ON public.budgets FOR INSERT
WITH CHECK (couple_id = get_user_couple_id(auth.uid()));

CREATE POLICY "Users can update couple budgets"
ON public.budgets FOR UPDATE
USING (couple_id = get_user_couple_id(auth.uid()));

CREATE POLICY "Users can delete couple budgets"
ON public.budgets FOR DELETE
USING (couple_id = get_user_couple_id(auth.uid()));

-- RLS policies for budget_items
CREATE POLICY "Users can view couple budget items"
ON public.budget_items FOR SELECT
USING (couple_id = get_user_couple_id(auth.uid()));

CREATE POLICY "Users can insert couple budget items"
ON public.budget_items FOR INSERT
WITH CHECK (couple_id = get_user_couple_id(auth.uid()));

CREATE POLICY "Users can update couple budget items"
ON public.budget_items FOR UPDATE
USING (couple_id = get_user_couple_id(auth.uid()));

CREATE POLICY "Users can delete couple budget items"
ON public.budget_items FOR DELETE
USING (couple_id = get_user_couple_id(auth.uid()));

-- Trigger for updated_at on budgets
CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON public.budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
