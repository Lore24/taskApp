import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, MoreHorizontal, Pencil, Trash2, CheckCircle2, Clock, ListTodo, Archive, ArchiveRestore, ChevronDown } from 'lucide-react';
import Header from '../components/layout/Header';
import EmptyState from '../components/shared/EmptyState';
import ProjectForm from '../components/projects/ProjectForm';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import useProjectStore from '../stores/useProjectStore';
import useTaskStore from '../stores/useTaskStore';

export default function DashboardPage() {
  const { projects, fetchProjects, deleteProject, archiveProject, restoreProject } = useProjectStore();
  const { tasks, fetchAllTasks, subtasks, fetchAllSubtasks } = useTaskStore();
  const navigate = useNavigate();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showArchivedProjects, setShowArchivedProjects] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchAllTasks();
    fetchAllSubtasks();
  }, []);

  const activeProjects = projects.filter((p) => !p.archived);
  const archivedProjects = projects.filter((p) => p.archived);

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const archived = projectTasks.filter((t) => t.status === 'archived').length;
    const activeTasks = projectTasks.filter((t) => t.status !== 'archived');
    const todo = activeTasks.filter((t) => t.status === 'todo').length;
    const inProgress = activeTasks.filter((t) => t.status === 'in_progress').length;
    const done = activeTasks.filter((t) => t.status === 'done').length;
    return { total: activeTasks.length, todo, inProgress, done, archived };
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle={`${activeProjects.length} project${activeProjects.length !== 1 ? 's' : ''}`}
        actions={
          <button
            onClick={() => { setEditingProject(null); setShowProjectForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent-violet hover:bg-accent-violet/80 transition-colors"
          >
            <Plus size={16} />
            New Project
          </button>
        }
      />

      <div className="p-6">
        {activeProjects.length === 0 && archivedProjects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start organizing your tasks and getting things done."
            action={
              <button
                onClick={() => setShowProjectForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent-violet hover:bg-accent-violet/80 transition-colors"
              >
                <Plus size={16} />
                Create Project
              </button>
            }
          />
        ) : (
          <>
            {activeProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeProjects.map((project) => {
                  const stats = getProjectStats(project.id);
                  const completionPct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

                  return (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/project/${project.id}`)}
                      className="group relative bg-surface-card border border-border rounded-xl p-5 cursor-pointer hover:shadow-lg hover:border-border/80 transition-all hover:scale-[1.01]"
                    >
                      {/* Color accent bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                        style={{ backgroundColor: project.color }}
                      />

                      {/* Menu */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === project.id ? null : project.id);
                          }}
                          className="p-1.5 rounded-lg text-content-tertiary opacity-0 group-hover:opacity-100 hover:text-content-primary hover:bg-surface-tertiary transition-all"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {openMenuId === project.id && (
                          <div className="absolute right-0 top-8 z-20 bg-surface-secondary border border-border rounded-lg shadow-xl py-1 min-w-[140px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProject(project);
                                setShowProjectForm(true);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-content-secondary hover:bg-surface-tertiary transition-colors"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                archiveProject(project.id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-content-secondary hover:bg-surface-tertiary transition-colors"
                            >
                              <Archive size={14} /> Archive
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(project);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-accent-rose hover:bg-surface-tertiary transition-colors"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-3 mb-4 mt-1">
                        <span
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${project.color}20` }}
                        >
                          <FolderKanban size={20} style={{ color: project.color }} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-content-primary truncate">{project.name}</h3>
                          {project.description && (
                            <p className="text-sm text-content-secondary line-clamp-1 mt-0.5">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-content-tertiary flex-wrap">
                        <span className="flex items-center gap-1">
                          <ListTodo size={12} /> {stats.todo} to do
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {stats.inProgress} active
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={12} /> {stats.done} done
                        </span>
                        {stats.archived > 0 && (
                          <span className="flex items-center gap-1">
                            <Archive size={12} /> {stats.archived} archived
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {stats.total > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-content-tertiary">Progress</span>
                            <span className="text-xs font-medium text-content-secondary">{completionPct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${completionPct}%`, backgroundColor: project.color }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeProjects.length === 0 && archivedProjects.length > 0 && (
              <EmptyState
                icon={FolderKanban}
                title="All projects archived"
                description="You have archived projects but no active ones. Create a new project or restore an archived one."
                action={
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent-violet hover:bg-accent-violet/80 transition-colors"
                  >
                    <Plus size={16} />
                    Create Project
                  </button>
                }
              />
            )}

            {/* Archived projects section */}
            {archivedProjects.length > 0 && (
              <div className="mt-8">
                <button
                  onClick={() => setShowArchivedProjects(!showArchivedProjects)}
                  className="flex items-center gap-2 text-sm text-content-tertiary hover:text-content-secondary transition-colors"
                >
                  <Archive size={16} />
                  {showArchivedProjects ? 'Hide' : 'Show'} archived projects ({archivedProjects.length})
                  <ChevronDown size={14} className={`transition-transform duration-200 ${showArchivedProjects ? 'rotate-180' : ''}`} />
                </button>
                {showArchivedProjects && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {archivedProjects.map((project) => {
                      const stats = getProjectStats(project.id);

                      return (
                        <div
                          key={project.id}
                          className="group relative bg-surface-card border border-border rounded-xl p-5 opacity-60 hover:opacity-80 transition-all"
                        >
                          {/* Color accent bar */}
                          <div
                            className="absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-50"
                            style={{ backgroundColor: project.color }}
                          />

                          {/* Restore button */}
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={() => restoreProject(project.id)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 text-accent-violet bg-accent-violet/10 hover:bg-accent-violet/20 transition-all"
                            >
                              <ArchiveRestore size={12} />
                              Restore
                            </button>
                          </div>

                          <div className="flex items-start gap-3 mb-4 mt-1">
                            <span
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${project.color}20` }}
                            >
                              <FolderKanban size={20} style={{ color: project.color }} />
                            </span>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-content-primary truncate line-through">{project.name}</h3>
                              {project.description && (
                                <p className="text-sm text-content-secondary line-clamp-1 mt-0.5">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-xs text-content-tertiary">
                            <span className="flex items-center gap-1">
                              {stats.total + stats.archived} task{stats.total + stats.archived !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <ProjectForm
        isOpen={showProjectForm}
        onClose={() => { setShowProjectForm(false); setEditingProject(null); }}
        project={editingProject}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteProject(deleteTarget.id)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will remove all tasks and subtasks in this project.`}
      />
    </div>
  );
}
