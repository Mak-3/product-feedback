import { z } from 'zod';
import { supabase } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

const feedbackSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  category: z.enum(['bug', 'feature', 'improvement', 'other']).optional(),
  project_id: z.string().uuid().optional()
});

export const getAllFeedback = async (req, res, next) => {
  try {
    const { project_id, category, status, sort = 'votes', order = 'desc' } = req.query;

    let query = supabase
      .from('feedback')
      .select('*, votes:feedback_votes(count)');

    if (project_id) query = query.eq('project_id', project_id);
    if (category) query = query.eq('category', category);
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order(sort, { ascending: order === 'asc' });

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const getFeedbackById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('feedback')
      .select('*, votes:feedback_votes(count)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Feedback not found', 404);

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const createFeedback = async (req, res, next) => {
  try {
    const validated = feedbackSchema.parse(req.body);

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        ...validated,
        user_id: req.user?.id || null,
        status: 'open'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = feedbackSchema.partial().parse(req.body);

    const { data, error } = await supabase
      .from('feedback')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.user.id) // Users can only update their own feedback
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Feedback not found or unauthorized', 404);

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const voteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 1 for upvote, -1 for downvote, 0 to remove

    if (![-1, 0, 1].includes(vote)) {
      throw new AppError('Invalid vote value', 400);
    }

    // For anonymous voting, use IP address as identifier
    const voterId = req.user?.id || req.ip;

    if (vote === 0) {
      // Remove vote
      const { error } = await supabase
        .from('feedback_votes')
        .delete()
        .eq('feedback_id', id)
        .eq('voter_id', voterId);

      if (error) throw error;
    } else {
      // Upsert vote
      const { error } = await supabase
        .from('feedback_votes')
        .upsert({
          feedback_id: id,
          voter_id: voterId,
          vote
        }, {
          onConflict: 'feedback_id,voter_id'
        });

      if (error) throw error;
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};




