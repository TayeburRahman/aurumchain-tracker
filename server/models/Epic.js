const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const StorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, default: 'todo' },
  tasks: [TaskSchema]
});

const EpicSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  pill: { type: String, required: true },
  pillClass: { type: String, required: true },
  barClass: { type: String, required: true },
  stories: [StorySchema]
});

module.exports = mongoose.model('Epic', EpicSchema);
