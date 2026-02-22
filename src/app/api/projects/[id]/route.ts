import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-server';
import { authenticate, handleError, AppError } from '@/lib/api-helpers';

const projectSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  website_url: z.string().url().optional(),
  is_public: z.boolean().default(true)
});

// GET /api/projects/[id] - Get project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { id } = await params;

    const { data, error } = await supabase
      .from('projects')
      .select('*, feedback(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Project not found', 404);

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/projects/[id] - Update project
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
    const updates = projectSchema.partial().parse(body);

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Project not found', 404);

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/projects/[id] - Delete project
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
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}

