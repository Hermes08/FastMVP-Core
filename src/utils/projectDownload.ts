/**
 * Utility functions for downloading generated projects
 */

interface ProjectConfig {
  name: string;
  description: string;
  features: string[];
  aiModels?: string[];
  template?: string;
}

/**
 * Download a project as a ZIP file
 * @param config - Project configuration
 * @param projectId - Optional project ID (generated if not provided)
 * @returns Promise<boolean> - Success status
 */
export async function downloadProject(
  config: ProjectConfig,
  projectId?: string
): Promise<boolean> {
  try {
    // Generate a project ID if not provided
    const id = projectId || generateProjectId(config.name);

    // Call the API to generate and download the project
    const response = await fetch(`/api/projects/${id}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: config.name,
        description: config.description,
        features: config.features,
        template: config.template || 'nextjs',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate project');
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a download link and trigger it
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name}.zip`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return true;
  } catch (error) {
    console.error('Error downloading project:', error);
    return false;
  }
}

/**
 * Generate a unique project ID from the project name
 * @param projectName - Name of the project
 * @returns string - Generated ID
 */
function generateProjectId(projectName: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 20);
  
  return `${slug}-${timestamp}-${random}`;
}

/**
 * Validate project configuration before download
 * @param config - Project configuration
 * @returns object - Validation result with isValid and error message
 */
export function validateProjectConfig(config: ProjectConfig): {
  isValid: boolean;
  error?: string;
} {
  if (!config.name || config.name.trim() === '') {
    return { isValid: false, error: 'Project name is required' };
  }

  if (!config.description || config.description.trim() === '') {
    return { isValid: false, error: 'Project description is required' };
  }

  if (!config.features || config.features.length === 0) {
    return { isValid: false, error: 'At least one feature must be selected' };
  }

  return { isValid: true };
}
