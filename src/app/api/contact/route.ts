import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConnect/dbConnect";
import Contact from "@/model/contactModel";

// POST API handler - Create a new contact submission
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    // Validate required fields
    const { name, email, message } = data;
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new contact submission
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating contact submission:", error);
    return NextResponse.json(
      { error: "Error creating contact submission" },
      { status: 500 }
    );
  }
}

// GET API handler - Retrieve all contact submissions
export async function GET() {
  try {
    await dbConnect();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      { error: "Error fetching contact submissions" },
      { status: 500 }
    );
  }
}

// PUT API handler - Update an existing contact submission
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("id");

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { name, email, message } = data;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return NextResponse.json(
        { error: "Contact submission not found" },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (name) contact.name = name;
    if (email) contact.email = email;
    if (message) contact.message = message;

    await contact.save();

    return NextResponse.json({ contact }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating contact submission:", error);
    return NextResponse.json(
      { error: "Error updating contact submission" },
      { status: 500 }
    );
  }
}

// DELETE API handler - Delete a contact submission
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("id");

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return NextResponse.json(
        { error: "Contact submission not found" },
        { status: 404 }
      );
    }

    // Delete contact submission
    await Contact.findByIdAndDelete(contactId);

    return NextResponse.json(
      { message: "Contact submission deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting contact submission:", error);
    return NextResponse.json(
      { error: "Error deleting contact submission" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
