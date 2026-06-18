import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/dbConnect/dbConnect";
import Post from "@/model/postModel";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "insta-posta" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );

    const Readable = require("stream").Readable;
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    const publicId = imageUrl.split("/").pop()?.split(".")[0];
    await cloudinary.uploader.destroy(`insta-posta/${publicId}`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

// POST API handler
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;
    const imageFile = formData.get("image") as File;

    if (!title || !description || !tags || !imageFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageUrl = await uploadToCloudinary(buffer);

    const post = await Post.create({
      title,
      description,
      tags: tags.split(","),
      image: imageUrl,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}

// GET API handler
export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

// PUT API handler
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;
    const imageFile = formData.get("image") as File | null;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update text fields
    if (title) post.title = title;
    if (description) post.description = description;
    if (tags) post.tags = tags.split(",");

    // Handle image update if new image provided
    if (imageFile) {
      // Delete old image from Cloudinary
      if (post.image) {
        await deleteFromCloudinary(post.image);
      }

      // Upload new image
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imageUrl = await uploadToCloudinary(buffer);
      post.image = imageUrl;
    }

    await post.save();

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}

// DELETE API handler
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (post.image) {
      await deleteFromCloudinary(post.image);
    }

    // Delete post from MongoDB
    await Post.findByIdAndDelete(postId);

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
