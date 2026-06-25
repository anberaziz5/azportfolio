import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Story } from "@/lib/models/story";

// Simple database connection helper built straight into your route handler
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  
  // This uses your existing MongoDB connection string from your environment variables
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
  return mongoose.connect(uri);
}

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Extract the optional category query parameter (e.g., /api/stories?category=education)
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    
    if (category) {
      const story = await Story.findOne({ category });
      return NextResponse.json({ success: true, data: story });
    }
    
    const allStories = await Story.find({});
    return NextResponse.json({ success: true, data: allStories });
  } catch (error: any) {
    console.error("Database route error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}