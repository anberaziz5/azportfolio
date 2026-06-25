import mongoose, { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true }, // For Markdown content
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Blog = models.Blog || model("Blog", BlogSchema);