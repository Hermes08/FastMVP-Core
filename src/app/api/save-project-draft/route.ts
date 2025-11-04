import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { projectId, stepData, currentStep } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    if (!stepData || !currentStep) {
      return NextResponse.json(
        { error: 'stepData and currentStep are required' },
        { status: 400 }
      );
    }

    // Prepare draft data structure for multi-step wizard
    const draftData = {
      current_step: currentStep,
      step_data: stepData,
      last_updated: new Date().toISOString(),
    };

    // Upsert project draft in sprint_projects table
    const { data: project, error: upsertError } = await supabase
      .from('sprint_projects')
      .upsert(
        {
          id: projectId,
          user_id: user.id,
          draft_data: draftData,
          is_draft: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single();

    if (upsertError) {
      console.error('Error saving project draft:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save project draft', details: upsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Project draft saved successfully',
        project,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in save-project-draft endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
