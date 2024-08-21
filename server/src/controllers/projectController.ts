import { Context } from 'koa';
import Project from '../models/Project';

export const getProjects = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const projects = await Project.find({ userId });
  ctx.body = projects;
};

export const createProject = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { name, description } = ctx.request.body;
  const project = new Project({ name, description, userId });
  await project.save();
  ctx.body = project;
};

export const updateProject = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { id } = ctx.params;
  const project = await Project.findOneAndUpdate(
    { _id: id, userId },
    ctx.request.body,
    { new: true }
  );
  if (!project) {
    ctx.status = 404;
    ctx.body = { error: 'Project not found' };
    return;
  }
  ctx.body = project;
};

export const deleteProject = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { id } = ctx.params;
  const project = await Project.findOneAndDelete({ _id: id, userId });
  if (!project) {
    ctx.status = 404;
    ctx.body = { error: 'Project not found' };
    return;
  }
  ctx.body = { message: 'Project deleted successfully' };
};
