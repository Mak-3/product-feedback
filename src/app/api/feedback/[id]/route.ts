import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-server';
import { authenticate, optionalAuth, handleError, AppError } from '@/lib/api-helpers';

const feedbackSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  category: z.enum(['bug', 'feature', 'improvement', 'other']).optional(),
  project_id: z.string().uuid().optional()
});

// GET /api/feedback/[id] - Get feedback by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await optionalAuth(request);
    const { id } = await params;

    const { data, error } = await supabase
      .from('feedback')
      .select('*, votes:feedback_votes(count)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Feedback not found', 404);

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/feedback/[id] - Update feedback
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { id } = await params;
    const body = await request.json();
    const updates = feedbackSchema.partial().parse(body);

    const { data, error } = await supabase
      .from('feedback')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id) // Users can only update their own feedback
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Feedback not found or unauthorized', 404);

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/feedback/[id] - Delete feedback
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { id } = await params;

    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}

