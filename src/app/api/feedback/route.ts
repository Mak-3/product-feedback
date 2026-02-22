import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-server';
import { optionalAuth, handleError, AppError } from '@/lib/api-helpers';

const feedbackSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  category: z.enum(['bug', 'feature', 'improvement', 'other']).optional(),
  project_id: z.string().uuid().optional()
});

// GET /api/feedback - Get all feedback
export async function GET(request: NextRequest) {
  try {
    const { user } = await optionalAuth(request);
    const { searchParams } = new URL(request.url);
    
    const project_id = searchParams.get('project_id');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'votes';
    const order = searchParams.get('order') || 'desc';

    let query = supabase
      .from('feedback')
      .select('*, votes:feedback_votes(count)');

    if (project_id) query = query.eq('project_id', project_id);
    if (category) query = query.eq('category', category);
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order(sort, { ascending: order === 'asc' });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/feedback - Create feedback
export async function POST(request: NextRequest) {
  try {
    const { user } = await optionalAuth(request);
    const body = await request.json();
    const validated = feedbackSchema.parse(body);

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        ...validated,
        user_id: user?.id || null,
        status: 'open'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

