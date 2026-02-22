import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError } from '@/lib/api-helpers';

// GET /api/api-keys - Get masked API key
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    // Check if user has an API key in their metadata
    const { data: { user: userData }, error: userError } = await supabaseAdmin.auth.admin.getUserById(user.id);
    
    if (userError) throw userError;
    if (!userData) throw new Error('User not found');

    const apiKey = userData.user_metadata?.api_key || null;

    // Return masked key if exists (show only last 8 characters)
    if (apiKey) {
      // API key format is pk_<hex>, so we show pk_<masked><last8>
      const keyWithoutPrefix = apiKey.startsWith('pk_') ? apiKey.slice(3) : apiKey;
      const maskedKey = `pk_${'•'.repeat(Math.max(0, keyWithoutPrefix.length - 8))}${keyWithoutPrefix.slice(-8)}`;
      return NextResponse.json({ 
        data: { 
          apiKey: maskedKey,
          hasKey: true 
        } 
      });
    } else {
      return NextResponse.json({ 
        data: { 
          apiKey: null,
          hasKey: false 
        } 
      });
    }
  } catch (error) {
    return handleError(error);
  }
}

