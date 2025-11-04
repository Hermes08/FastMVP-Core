import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    // Get cookies and create authenticated Supabase client
    const cookieStore = await cookies();
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: cookieStore.get('sb-access-token')?.value,
      },
    });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { 
      title,
      description, 
      selectedFeatures, 
      aiModels, 
      supabaseConfig, 
      githubRepo,
      generatedCommand 
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    // Insert project into sprint_projects table
    const { data, error } = await supabase
      .from('sprint_projects')
      .insert({
        user_id: user.id,
        title: title,
        description: description || null,
        status: 'draft',
        metadata: {
          selected_features: selectedFeatures || [],
          ai_models: aiModels || [],
          supabase_config: supabaseConfig || {},
          github_repo: githubRepo || null,
          generated_command: generatedCommand || null,
        },
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create project', details: error.message },
        { status: 500 }
      );
    }

    // Return the created project ID
    return NextResponse.json(
      { 
        success: true, 
        projectId: data.id,
        message: 'Project created successfully' 
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating project:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
