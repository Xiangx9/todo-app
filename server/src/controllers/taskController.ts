import { Context } from 'koa';
import Task from '../models/Task';
var dayjs = require('dayjs')

// 获取任务列表
export const getTasks = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  let { priority,dueDate } = ctx.query
  let filter: any = {
    userId
  }
  
  // 按优先级查询，
  priority == '1' ? '' : filter.priority = priority

  //按时间查询
  //获取指定日期所在月的第一天
  const firstDate = dayjs(dueDate).startOf("month").format("YYYY-MM-DD");
  //获取指定日期所在月的第一天
  const lastDate = dayjs(dueDate).endOf("month").format("YYYY-MM-DD")
  dueDate? filter.dueDate = { $gte: firstDate, $lte: lastDate }:''


  const { pageSize = 10, pageNumber = 1 } = ctx.query;
  const totalCount = await Task.countDocuments().exec();//获取总数
  const tasks = await Task.find(filter).skip(((pageNumber as number) - 1) * (pageSize as number)).limit(pageSize as number).sort({ 'createdAt': -1 }).exec();
  ctx.body = { tasks, totalCount, message: '获取成功' };
};

// 创建任务
export const createTask = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { title, description, priority, dueDate } = ctx.request.body;
  const task = new Task({ title, description, priority, dueDate, userId });
  await task.save();
  ctx.body = { task, message: '创建成功' };
};

// 更新任务
export const updateTask = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { id, title, description, priority, dueDate, completed } = ctx.request.body;
  const task = await Task.findByIdAndUpdate(id, { title, description, priority, dueDate, completed }, { new: true });
  ctx.body = { task, message: '更新成功' };
}

// 删除任务
export const deleteTask = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { id } = ctx.params;
  await Task.findByIdAndDelete(id);
  ctx.body = { message: '删除成功' };
}

// 标记任务完成
export const completeTask = async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const { id } = ctx.params;
  const task = await Task.findByIdAndUpdate(id, { completed: true }, { new: true });
  ctx.body = { task, message: '完成' };
}