import { NextRequest, NextResponse } from 'next/server';

interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { repository } = await request.json();

    if (!repository) {
      return NextResponse.json(
        { valid: false, error: 'Repository parameter is required' },
        { status: 400 }
      );
    }

    // Validate repository format (owner/repo)
    const repoPattern = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
    if (!repoPattern.test(repository)) {
      return NextResponse.json(
        { valid: false, error: 'Invalid repository format. Use: owner/repo' },
        { status: 400 }
      );
    }

    // Call GitHub API to validate repository
    const response = await fetch(`https://api.github.com/repos/${repository}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'FastMVP-Core',
      },
    });

    if (response.status === 404) {
      return NextResponse.json({
        valid: false,
        error: 'Repository not found',
      });
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          valid: false,
          error: `GitHub API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const repoData: GitHubRepoResponse = await response.json();

    return NextResponse.json({
      valid: true,
      repository: {
        id: repoData.id,
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        language: repoData.language,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        owner: {
          login: repoData.owner.login,
          avatarUrl: repoData.owner.avatar_url,
        },
      },
    });
  } catch (error) {
    console.error('Error validating GitHub repository:', error);
    return NextResponse.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
