import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },//项目名称
  description: String, //项目描述
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //创建项目的人
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
