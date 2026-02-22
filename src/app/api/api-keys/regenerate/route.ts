import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError } from '@/lib/api-helpers';

// Generate a secure API key using crypto.randomBytes
const generateApiKey = () => {
  // Generate 32 random bytes and convert to hex string
  const randomBytes = crypto.randomBytes(32);
  return `pk_${randomBytes.toString('hex')}`;
};

// POST /api/api-keys/regenerate - Generate or regenerate API key
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const newApiKey = generateApiKey();

    // Update user metadata with the new API key
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          api_key: newApiKey
        }
      }
    );

    if (error) throw error;

    // Return the full key only once (for display after generation)
    return NextResponse.json({ 
      data: { 
        apiKey: newApiKey,
        message: 'API key generated successfully'
      } 
    });
  } catch (error) {
    return handleError(error);
  }
}

