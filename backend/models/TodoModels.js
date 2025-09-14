import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const TodoSchema = new Schema({
  task: {
    type: String,
    required: [true, 'Task is required'],
    trim: true,
    maxlength: [100, 'Task cannot exceed 100 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Todo', TodoSchema);
