import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, credentials } = await request.json();

    if (type === 'supabase') {
      const { url, key } = credentials;
      
      if (!url || !key) {
        return NextResponse.json(
          { valid: false, error: 'Missing Supabase credentials' },
          { status: 400 }
        );
      }

      try {
        const healthUrl = `${url}/rest/v1/_health`;
        const response = await fetch(healthUrl, {
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
          }
        });

        return NextResponse.json({ valid: response.ok });
      } catch (error) {
        return NextResponse.json({ valid: false });
      }
    }

    if (type === 'github') {
      const { token, repo } = credentials;
      
      if (!token || !repo) {
        return NextResponse.json(
          { valid: false, error: 'Missing GitHub credentials' },
          { status: 400 }
        );
      }

      try {
        const apiUrl = `https://api.github.com/repos/${repo}`;
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });

        return NextResponse.json({ valid: response.ok });
      } catch (error) {
        return NextResponse.json({ valid: false });
      }
    }

    return NextResponse.json(
      { valid: false, error: 'Invalid type. Must be "supabase" or "github"' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: 'Invalid request format' },
      { status: 400 }
    );
  }
}
