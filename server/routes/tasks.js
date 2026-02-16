const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../utils/db');

const router = express.Router();

// GET /api/tasks
router.get('/', (req, res) => {
  const db = readDB();
  let tasks = db.tasks;
  if (req.query.projectId) {
    tasks = tasks.filter((t) => t.projectId === req.query.projectId);
  }
  res.json(tasks);
});

// GET /api/tasks/:id
router.get('/:id', (req, res) => {
  const db = readDB();
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /api/tasks
router.post('/', (req, res) => {
  const db = readDB();
  const now = new Date().toISOString();

  // Calculate order: place at end of the status column for this project
  const sameStatusTasks = db.tasks.filter(
    (t) => t.projectId === req.body.projectId && t.status === (req.body.status || 'todo')
  );
  const maxOrder = sameStatusTasks.reduce((max, t) => Math.max(max, t.order || 0), -1);

  const task = {
    id: `task_${uuidv4().slice(0, 8)}`,
    projectId: req.body.projectId,
    title: req.body.title || 'Untitled Task',
    notes: req.body.notes || '',
    status: req.body.status || 'todo',
    assignee: req.body.assignee || 'Lauren',
    startDate: req.body.startDate || null,
    dueDate: req.body.dueDate || null,
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };
  db.tasks.push(task);
  writeDB(db);
  res.status(201).json(task);
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const db = readDB();
  const index = db.tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  db.tasks[index] = {
    ...db.tasks[index],
    ...req.body,
    id: db.tasks[index].id,
    createdAt: db.tasks[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  res.json(db.tasks[index]);
});

// PATCH /api/tasks/:id
router.patch('/:id', (req, res) => {
  const db = readDB();
  const index = db.tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  db.tasks[index] = {
    ...db.tasks[index],
    ...req.body,
    id: db.tasks[index].id,
    createdAt: db.tasks[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  res.json(db.tasks[index]);
});

// PATCH /api/tasks/batch/reorder
router.patch('/batch/reorder', (req, res) => {
  const db = readDB();
  const updates = req.body; // Array of { id, status, order }

  if (!Array.isArray(updates)) {
    return res.status(400).json({ error: 'Expected an array of updates' });
  }

  updates.forEach((update) => {
    const index = db.tasks.findIndex((t) => t.id === update.id);
    if (index !== -1) {
      if (update.status !== undefined) db.tasks[index].status = update.status;
      if (update.order !== undefined) db.tasks[index].order = update.order;
      db.tasks[index].updatedAt = new Date().toISOString();
    }
  });

  writeDB(db);
  res.json({ success: true });
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const db = readDB();
  const index = db.tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  // Cascade delete subtasks
  db.subtasks = db.subtasks.filter((s) => s.taskId !== req.params.id);
  db.tasks.splice(index, 1);
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
