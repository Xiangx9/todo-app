import { Context } from 'koa';
import Task from '../models/Task';

export const getTasks = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const tasks = await Task.find({ userId });
  ctx.body = tasks;
};

export const createTask = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { title, description, priority, dueDate } = ctx.request.body;
  const task = new Task({ title, description, priority, dueDate, userId });
  await task.save();
  ctx.body = task;
};
