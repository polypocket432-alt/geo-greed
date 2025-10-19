-- Create price alerts table
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_brand TEXT,
  store_id TEXT NOT NULL,
  store_name TEXT NOT NULL,
  target_price NUMERIC NOT NULL,
  current_price NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for price alerts
CREATE POLICY "Users can view their own price alerts" 
ON public.price_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own price alerts" 
ON public.price_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own price alerts" 
ON public.price_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price alerts" 
ON public.price_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_price_alerts_updated_at
BEFORE UPDATE ON public.price_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();