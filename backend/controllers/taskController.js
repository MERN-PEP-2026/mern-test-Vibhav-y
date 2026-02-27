const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate, tags } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    tags,
    createdBy: req.user._id
  });

  res.status(201).json(task);
});

const getTasks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const statusFilter = req.query.status;
  const searchTerm = req.query.search;
  const sortBy = req.query.sortBy === 'dueDate' ? 'dueDate' : 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;

  const filters = { createdBy: req.user._id };
  if (statusFilter && ['pending', 'completed'].includes(statusFilter)) {
    filters.status = statusFilter;
  }
  if (searchTerm) {
    filters.title = { $regex: searchTerm, $options: 'i' };
  }

  const total = await Task.countDocuments(filters);
  const tasks = await Task.find(filters)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ page, limit, total, tasks });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  if (task.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not allowed to modify this task');
  }

  const allowedUpdates = ['title', 'description', 'status', 'dueDate', 'tags'];
  Object.keys(req.body).forEach((field) => {
    if (allowedUpdates.includes(field)) {
      task[field] = req.body[field];
    }
  });

  await task.save();
  res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  if (task.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not allowed to delete this task');
  }

  await task.remove();
  res.json({ message: 'Task removed' });
});

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
