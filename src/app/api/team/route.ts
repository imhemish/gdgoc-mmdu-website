import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/dbConnect/dbConnect";
import Team from "@/model/teamModel";

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
      {
        folder: "team-members",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
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
    // Extract public ID from the URL
    const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
    await cloudinary.uploader.destroy(`team-members/${publicId}`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

// POST API handler
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Parse the form data
    const formData = await req.formData();

    // Extract fields
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const batch = formData.get("batch") as string;
    const quote = formData.get("quote") as string;
    const imageFile = formData.get("image") as File;

    // Validate required fields
    if (!name || !position || !batch || !imageFile || !quote) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(buffer);

    // Save to MongoDB
    const team = await Team.create({
      name,
      position,
      batch,
      image: imageUrl,
      quote,
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating team member:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error creating team member" },
      { status: 500 }
    );
  }
}

// GET API handler
export async function GET() {
  try {
    await dbConnect();

    const teams = await Team.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ teams }, { status: 200 });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Error fetching team members" },
      { status: 500 }
    );
  }
}

// PUT API handler for updating team member
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // Get team member ID from the URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Team member ID is required" },
        { status: 400 }
      );
    }

    // Find existing team member
    const existingTeam = await Team.findById(id);
    if (!existingTeam) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Parse the form data
    const formData = await req.formData();

    // Extract fields
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const batch = formData.get("batch") as string;
    const quote = formData.get("quote") as string;
    const imageFile = formData.get("image") as File | null;

    // Prepare update object
    const updateData: any = {
      name: name || existingTeam.name,
      position: position || existingTeam.position,
      batch: batch || existingTeam.batch,
      quote: quote || existingTeam.quote,
    };

    // Handle image update if new image is provided
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Delete old image from Cloudinary
      await deleteFromCloudinary(existingTeam.image);

      // Upload new image
      const imageUrl = await uploadToCloudinary(buffer);
      updateData.image = imageUrl;
    }

    // Update in MongoDB
    const updatedTeam = await Team.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ team: updatedTeam }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating team member:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error updating team member" },
      { status: 500 }
    );
  }
}

// DELETE API handler
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    // Get team member ID from the URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Team member ID is required" },
        { status: 400 }
      );
    }

    // Find team member to get image URL
    const teamMember = await Team.findById(id);
    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary
    await deleteFromCloudinary(teamMember.image);

    // Delete from MongoDB
    await Team.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Team member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Error deleting team member" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};
