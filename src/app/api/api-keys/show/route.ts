import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError, AppError } from '@/lib/api-helpers';

// GET /api/api-keys/show - Get full API key
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { data: { user: userData }, error: userError } = await supabaseAdmin.auth.admin.getUserById(user.id);
    
    if (userError) throw userError;
    if (!userData) throw new AppError('User not found', 404);

    const apiKey = userData.user_metadata?.api_key;

    if (!apiKey) {
      throw new AppError('No API key found. Please generate one first.', 404);
    }

    return NextResponse.json({ 
      data: { 
        apiKey: apiKey
      } 
    });
  } catch (error) {
    return handleError(error);
  }
}

