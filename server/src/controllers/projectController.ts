import { Context } from 'koa';
import Project from '../models/Project';

// 获取项目列表
export const getProjects = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const projects = await Project.find({ userId });
  ctx.body = projects;
};

//创建项目
export const createProject = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { name, description } = ctx.request.body;
  let projectName = await Project.findOne({ name, userId });
  if (projectName) {
    ctx.status = 400;
    ctx.body = { message: '项目名称已存在' };
    return;
  }
  const project = new Project({ name, description, userId });
  await project.save();
  ctx.body = {project, message: '添加成功' };
};

// 更新项目
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
    ctx.body = { error: '没有找到项目' };
    return;
  }
  ctx.body = {project, message: '更新成功' };
};


// 删除项目
export const deleteProject = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { id } = ctx.params;
  const project = await Project.findOneAndDelete({ _id: id, userId });
  if (!project) {
    ctx.status = 404;
    ctx.body = { error: '没有找到项目' };
    return;
  }
  ctx.body = { message: '删除成功' };
};
