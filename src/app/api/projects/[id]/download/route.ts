import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';
import { ProjectGenerator } from '@/services/projectGenerator';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/projects/[id]/download - Download project as ZIP
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const projectId = params.id;
    
    // Get project configuration from database or storage
    // For now, using a mock configuration
    const projectConfig = {
      name: `project-${projectId}`,
      description: 'Generated MVP Project',
      features: ['Authentication', 'Dashboard', 'API'],
      template: 'nextjs' as const
    };

    // Generate project
    const generator = new ProjectGenerator();
    const zipPath = await generator.generateProject(projectConfig);

    // Check if file exists
    if (!await fs.pathExists(zipPath)) {
      return NextResponse.json(
        { error: 'Project file not found' },
        { status: 404 }
      );
    }

    // Read the ZIP file
    const fileBuffer = await fs.readFile(zipPath);
    
    // Clean up the ZIP file after reading
    await fs.remove(zipPath);

    // Return the ZIP file as a download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectConfig.name}.zip"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating project:', error);
    return NextResponse.json(
      { error: 'Failed to generate project' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/download - Generate and download project with custom config
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const projectId = params.id;
    const body = await request.json();
    
    const projectConfig = {
      name: body.name || `project-${projectId}`,
      description: body.description || 'Generated MVP Project',
      features: body.features || [],
      template: body.template || 'nextjs' as const
    };

    // Validate configuration
    if (!projectConfig.name || projectConfig.name.trim() === '') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Generate project
    const generator = new ProjectGenerator();
    const zipPath = await generator.generateProject(projectConfig);

    // Check if file exists
    if (!await fs.pathExists(zipPath)) {
      return NextResponse.json(
        { error: 'Failed to generate project file' },
        { status: 500 }
      );
    }

    // Read the ZIP file
    const fileBuffer = await fs.readFile(zipPath);
    
    // Clean up the ZIP file after reading
    await fs.remove(zipPath);

    // Return the ZIP file as a download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectConfig.name}.zip"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating project:', error);
    return NextResponse.json(
      { error: 'Failed to generate project' },
      { status: 500 }
    );
  }
}
