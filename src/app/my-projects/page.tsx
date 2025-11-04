'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export default function MyProjectsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      await fetchProjects(user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    }
  }

  async function fetchProjects(userId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(projectId: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return;
    }

    try {
      setDeletingId(projectId);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user?.id); // Extra security: only delete own projects

      if (error) {
        console.error('Error deleting project:', error);
        alert('Error al eliminar el proyecto');
        return;
      }

      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRegenerate(projectId: string) {
    if (!confirm('¿Quieres regenerar este proyecto? Esto creará una nueva versión.')) {
      return;
    }

    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      // Redirect to builder with project data for regeneration
      router.push(`/builder?regenerate=${projectId}`);
    } catch (error) {
      console.error('Error regenerating project:', error);
      alert('Error al regenerar el proyecto');
    }
  }

  function getStatusBadgeClass(status: string) {
    const statusLower = status?.toLowerCase() || 'unknown';
    if (statusLower.includes('complete') || statusLower.includes('ready')) {
      return 'bg-green-100 text-green-800';
    }
    if (statusLower.includes('progress') || statusLower.includes('building')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (statusLower.includes('error') || statusLower.includes('failed')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos Sprint</h1>
              <p className="mt-2 text-gray-600">
                Administra y visualiza todos tus proyectos creados
              </p>
            </div>
            <Link
              href="/new-project"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Nuevo Proyecto
            </Link>
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No tienes proyectos todavía
              </h3>
              <p className="mt-2 text-gray-500">
                Comienza creando tu primer proyecto sprint
              </p>
              <Link
                href="/new-project"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Crear Proyecto
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Project Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {project.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                        project.status
                      )}`}
                    >
                      {project.status || 'Pendiente'}
                    </span>
                  </div>

                  {/* Project Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description || 'Sin descripción'}
                  </p>

                  {/* Project Dates */}
                  <div className="space-y-1 mb-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Creado:</span> {formatDate(project.created_at)}
                    </div>
                    {project.updated_at && project.updated_at !== project.created_at && (
                      <div>
                        <span className="font-medium">Actualizado:</span> {formatDate(project.updated_at)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                    <Link
                      href={`/builder/${project.id}`}
                      className="w-full text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Ver Detalles
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRegenerate(project.id)}
                        className="flex-1 px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-md hover:bg-green-100 transition-colors"
                      >
                        Regenerar
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === project.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {projects.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
                <div className="text-sm text-gray-600">Total Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {projects.filter(p => p.status?.toLowerCase().includes('complete')).length}
                </div>
                <div className="text-sm text-gray-600">Completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {projects.filter(p => p.status?.toLowerCase().includes('progress')).length}
                </div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {projects.filter(p => p.status?.toLowerCase().includes('error')).length}
                </div>
                <div className="text-sm text-gray-600">Con Errores</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
