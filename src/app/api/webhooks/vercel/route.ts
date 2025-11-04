import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface VercelWebhookPayload {
  deploymentUrl: string;
  status: string;
  projectId: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: VercelWebhookPayload = await request.json();
    const { deploymentUrl, status, projectId } = payload;

    // Validate required fields
    if (!deploymentUrl || !status || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields: deploymentUrl, status, or projectId' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Update the project in sprint_projects table
    const { data, error } = await supabase
      .from('sprint_projects')
      .update({
        deployment_url: deploymentUrl,
        deployment_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('vercel_project_id', projectId)
      .select();

    if (error) {
      console.error('Error updating sprint_projects:', error);
      return NextResponse.json(
        { error: 'Failed to update project', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', projectId },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Project updated successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
