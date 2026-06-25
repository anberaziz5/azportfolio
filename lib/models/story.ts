import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, unique: true }, // 'education', 'life', or 'research'
  content: { type: String, required: true }, // Holds your raw Markdown text strings
  updatedAt: { type: Date, default: Date.now }
});

export const Story = mongoose.models.Story || mongoose.model("Story", StorySchema);