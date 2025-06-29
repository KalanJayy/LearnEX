
-- Create roadmaps table to store user's generated roadmaps
CREATE TABLE public.roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  goal TEXT NOT NULL,
  steps JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress table to track completion of roadmap steps
CREATE TABLE public.roadmap_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE NOT NULL,
  step_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(roadmap_id, step_id)
);

-- Enable Row Level Security
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for roadmaps table
CREATE POLICY "Users can view their own roadmaps" 
  ON public.roadmaps 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own roadmaps" 
  ON public.roadmaps 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps" 
  ON public.roadmaps 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps" 
  ON public.roadmaps 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for roadmap_progress table
CREATE POLICY "Users can view progress for their roadmaps" 
  ON public.roadmap_progress 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.roadmaps 
    WHERE roadmaps.id = roadmap_progress.roadmap_id 
    AND roadmaps.user_id = auth.uid()
  ));

CREATE POLICY "Users can create progress for their roadmaps" 
  ON public.roadmap_progress 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.roadmaps 
    WHERE roadmaps.id = roadmap_progress.roadmap_id 
    AND roadmaps.user_id = auth.uid()
  ));

CREATE POLICY "Users can update progress for their roadmaps" 
  ON public.roadmap_progress 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.roadmaps 
    WHERE roadmaps.id = roadmap_progress.roadmap_id 
    AND roadmaps.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete progress for their roadmaps" 
  ON public.roadmap_progress 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.roadmaps 
    WHERE roadmaps.id = roadmap_progress.roadmap_id 
    AND roadmaps.user_id = auth.uid()
  ));
