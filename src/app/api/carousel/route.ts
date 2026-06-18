import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/dbConnect/dbConnect";
import Carousel from "@/model/carouselModel";

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
      { folder: "carousel-images" },
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
    await cloudinary.uploader.destroy(`carousel-images/${publicId}`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const imageFile = formData.get("image") as File;
    const black = formData.get("black") === "true"; // Convert string to Boolean

    if (!title || !imageFile || black === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageUrl = await uploadToCloudinary(buffer);

    const carousel = await Carousel.create({
      title,
      image: imageUrl,
      black,
    });

    return NextResponse.json({ carousel }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating carousel item:", error);
    return NextResponse.json(
      { error: "Error creating carousel item" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const carousels = await Carousel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ carousels }, { status: 200 });
  } catch (error) {
    console.error("Error fetching carousel items:", error);
    return NextResponse.json(
      { error: "Error fetching carousel items" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const { searchParams } = new URL(req.url);
    const carouselId = searchParams.get("id");

    const title = formData.get("title") as string;
    const imageFile = formData.get("image") as File | null;
    const black = formData.get("black") === "true";

    if (!carouselId) {
      return NextResponse.json(
        { error: "Carousel ID is required" },
        { status: 400 }
      );
    }

    const carousel = await Carousel.findById(carouselId);
    if (!carousel) {
      return NextResponse.json(
        { error: "Carousel item not found" },
        { status: 404 }
      );
    }

    if (title) carousel.title = title;
    if (black !== undefined) carousel.black = black;

    if (imageFile) {
      if (carousel.image) {
        await deleteFromCloudinary(carousel.image);
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imageUrl = await uploadToCloudinary(buffer);
      carousel.image = imageUrl;
    }

    await carousel.save();

    return NextResponse.json({ carousel }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating carousel item:", error);
    return NextResponse.json(
      { error: "Error updating carousel item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const carouselId = searchParams.get("id");

    if (!carouselId) {
      return NextResponse.json(
        { error: "Carousel ID is required" },
        { status: 400 }
      );
    }

    const carousel = await Carousel.findById(carouselId);
    if (!carousel) {
      return NextResponse.json(
        { error: "Carousel item not found" },
        { status: 404 }
      );
    }

    if (carousel.image) {
      await deleteFromCloudinary(carousel.image);
    }

    await Carousel.findByIdAndDelete(carouselId);

    return NextResponse.json(
      { message: "Carousel item deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting carousel item:", error);
    return NextResponse.json(
      { error: "Error deleting carousel item" },
      { status: 500 }
    );
  }
}
