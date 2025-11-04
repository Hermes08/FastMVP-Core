/**
 * GitHub API client utility for repository creation
 */

const GITHUB_API_BASE = 'https://api.github.com';

interface CreateRepoResponse {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
}

/**
 * Creates a new public repository on GitHub
 * @param repoName - The name of the repository to create
 * @param token - GitHub personal access token with repo scope
 * @returns Promise with the created repository data
 */
export async function createRepo(
  repoName: string,
  token: string
): Promise<CreateRepoResponse> {
  const response = await fetch(`${GITHUB_API_BASE}/user/repos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({
      name: repoName,
      private: false,
      auto_init: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create repository: ${error.message || response.statusText}`);
  }

  return response.json();
}
