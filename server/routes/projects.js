const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../utils/db');

const router = express.Router();

// GET /api/projects
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.projects);
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  const db = readDB();
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// POST /api/projects
router.post('/', (req, res) => {
  const db = readDB();
  const now = new Date().toISOString();
  const project = {
    id: `proj_${uuidv4().slice(0, 8)}`,
    name: req.body.name || 'Untitled Project',
    description: req.body.description || '',
    color: req.body.color || '#8B5CF6',
    createdAt: now,
    updatedAt: now,
  };
  db.projects.push(project);
  writeDB(db);
  res.status(201).json(project);
});

// PUT /api/projects/:id
router.put('/:id', (req, res) => {
  const db = readDB();
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  db.projects[index] = {
    ...db.projects[index],
    ...req.body,
    id: db.projects[index].id,
    createdAt: db.projects[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  res.json(db.projects[index]);
});

// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  const db = readDB();
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  // Cascade delete: remove tasks and their subtasks
  const taskIds = db.tasks.filter((t) => t.projectId === req.params.id).map((t) => t.id);
  db.subtasks = db.subtasks.filter((s) => !taskIds.includes(s.taskId));
  db.tasks = db.tasks.filter((t) => t.projectId !== req.params.id);
  db.projects.splice(index, 1);
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
