-- Create telegram_config table
CREATE TABLE public.telegram_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_token text NOT NULL,
  chat_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access (needed for the menu page to fetch config)
CREATE POLICY "Allow public read access to telegram_config"
ON public.telegram_config
FOR SELECT
USING (true);

-- Insert the current bot configuration
INSERT INTO public.telegram_config (bot_token, chat_id)
VALUES ('7909127979:AAFv04EAjvS53YMpGcRWcLcNXIBuZVALEW4', '-4589260433');