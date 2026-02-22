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

// GET /api/projects - Get all user's projects
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { data, error } = await supabase
      .from('projects')
      .select('*, feedback(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/projects - Create project
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const body = await request.json();
    const validated = projectSchema.parse(body);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...validated,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

