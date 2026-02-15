import { z } from 'zod';
import { supabase } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

const projectSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  website_url: z.string().url().optional(),
  is_public: z.boolean().default(true)
});

export const getAllProjects = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, feedback(count)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('projects')
      .select('*, feedback(*)')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Project not found', 404);

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const validated = projectSchema.parse(req.body);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...validated,
        user_id: req.user.id
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = projectSchema.partial().parse(req.body);

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Project not found', 404);

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

