import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { optionalAuth, handleError, AppError } from '@/lib/api-helpers';

// POST /api/feedback/[id]/vote - Vote on feedback
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await optionalAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { vote } = body; // 1 for upvote, -1 for downvote, 0 to remove

    if (![-1, 0, 1].includes(vote)) {
      throw new AppError('Invalid vote value', 400);
    }

    // For anonymous voting, use IP address as identifier
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'anonymous';
    const voterId = user?.id || ip;

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

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}

