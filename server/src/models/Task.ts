import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },//任务内容
  description: String, //任务描述
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }, //任务优先级
  dueDate: Date, //任务截止日期
  completed: { type: Boolean, default: false },//任务是否完成
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//任务所属用户
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },//任务所属项目
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
