import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    // 1. Search for project by projectId
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // 2. Update project status to 'generating'
    const { error: updateGeneratingError } = await supabase
      .from('projects')
      .update({ status: 'generating' })
      .eq('id', projectId);

    if (updateGeneratingError) {
      return NextResponse.json(
        { error: 'Failed to update project status to generating' },
        { status: 500 }
      );
    }

    // 3. Generate configId
    const configId = randomUUID();

    // 4. Update project status to 'completed' with configId
    const { error: updateCompletedError } = await supabase
      .from('projects')
      .update({ 
        status: 'completed',
        config_id: configId
      })
      .eq('id', projectId);

    if (updateCompletedError) {
      return NextResponse.json(
        { error: 'Failed to update project status to completed' },
        { status: 500 }
      );
    }

    // 5. Generate and return command with configId
    const command = `npx create-fastmvp-app --config ${configId}`;

    return NextResponse.json({
      success: true,
      projectId,
      configId,
      command,
      status: 'completed'
    });

  } catch (error) {
    console.error('Error generating project sprint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
