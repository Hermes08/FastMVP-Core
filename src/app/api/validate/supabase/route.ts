import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, anonKey } = await request.json();

    if (!url || !anonKey) {
      return NextResponse.json(
        { valid: false, error: 'URL and anonKey are required' },
        { status: 400 }
      );
    }

    // Create Supabase client with provided credentials
    const supabase = createClient(url, anonKey);

    // Query _health endpoint to validate connection
    const { data, error } = await supabase.from('_health').select('*').limit(1);

    if (error) {
      return NextResponse.json(
        { valid: false, error: error.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, error: error.message || 'Invalid credentials' },
      { status: 200 }
    );
  }
}
