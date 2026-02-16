const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../utils/db');

const router = express.Router();

// GET /api/subtasks
router.get('/', (req, res) => {
  const db = readDB();
  let subtasks = db.subtasks;
  if (req.query.taskId) {
    subtasks = subtasks.filter((s) => s.taskId === req.query.taskId);
  }
  res.json(subtasks);
});

// GET /api/subtasks/:id
router.get('/:id', (req, res) => {
  const db = readDB();
  const subtask = db.subtasks.find((s) => s.id === req.params.id);
  if (!subtask) return res.status(404).json({ error: 'Subtask not found' });
  res.json(subtask);
});

// POST /api/subtasks
router.post('/', (req, res) => {
  const db = readDB();
  const now = new Date().toISOString();

  const sameTaskSubtasks = db.subtasks.filter((s) => s.taskId === req.body.taskId);
  const maxOrder = sameTaskSubtasks.reduce((max, s) => Math.max(max, s.order || 0), -1);

  const subtask = {
    id: `sub_${uuidv4().slice(0, 8)}`,
    taskId: req.body.taskId,
    title: req.body.title || 'Untitled Subtask',
    notes: req.body.notes || '',
    status: req.body.status || 'todo',
    assignee: req.body.assignee || 'Lauren',
    startDate: req.body.startDate || null,
    dueDate: req.body.dueDate || null,
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };
  db.subtasks.push(subtask);
  writeDB(db);
  res.status(201).json(subtask);
});

// PUT /api/subtasks/:id
router.put('/:id', (req, res) => {
  const db = readDB();
  const index = db.subtasks.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Subtask not found' });

  db.subtasks[index] = {
    ...db.subtasks[index],
    ...req.body,
    id: db.subtasks[index].id,
    createdAt: db.subtasks[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  res.json(db.subtasks[index]);
});

// PATCH /api/subtasks/:id
router.patch('/:id', (req, res) => {
  const db = readDB();
  const index = db.subtasks.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Subtask not found' });

  db.subtasks[index] = {
    ...db.subtasks[index],
    ...req.body,
    id: db.subtasks[index].id,
    createdAt: db.subtasks[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  res.json(db.subtasks[index]);
});

// DELETE /api/subtasks/:id
router.delete('/:id', (req, res) => {
  const db = readDB();
  const index = db.subtasks.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Subtask not found' });

  db.subtasks.splice(index, 1);
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
