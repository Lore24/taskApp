import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import useProjectStore from '../../stores/useProjectStore';
import { PROJECT_COLORS } from '../../utils/constants';

export default function ProjectForm({ isOpen, onClose, project }) {
  const { createProject, updateProject } = useProjectStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0].value);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      setColor(project.color);
    } else {
      setName('');
      setDescription('');
      // Pick a random color for new projects
      setColor(PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)].value);
    }
  }, [project, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (project) {
      await updateProject(project.id, { name: name.trim(), description: description.trim(), color });
    } else {
      await createProject({ name: name.trim(), description: description.trim(), color });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Edit Project' : 'New Project'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-content-secondary mb-1.5">
            Project Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Launch Marketing Site"
            autoFocus
            className="w-full px-3 py-2 bg-surface-tertiary border border-border rounded-lg text-content-primary placeholder-content-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 focus:border-accent-violet transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-secondary mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's the goal of this project?"
            rows={2}
            className="w-full px-3 py-2 bg-surface-tertiary border border-border rounded-lg text-content-primary placeholder-content-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 focus:border-accent-violet transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-secondary mb-2">
            Color
          </label>
          <div className="flex gap-2">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  color === c.value ? 'ring-2 ring-offset-2 ring-offset-surface-secondary scale-110' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.value, ringColor: c.value }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-content-secondary bg-surface-tertiary hover:bg-surface-tertiary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent-violet hover:bg-accent-violet/80 transition-colors"
          >
            {project ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
