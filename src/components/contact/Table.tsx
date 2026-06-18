import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Eye, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

// TypeScript interface for Contact type
interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  __v?: number;
}

const ContactAdminTable = () => {
  // State for contacts and loading/error handling
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  // State for selected contact details dialog
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const data = await response.json();
      setRawResponse(data);

      let contactsArray: Contact[] = [];
      if (Array.isArray(data)) {
        contactsArray = data;
      } else if (data && data.contacts && Array.isArray(data.contacts)) {
        contactsArray = data.contacts;
      } else if (data && data.data && Array.isArray(data.data)) {
        contactsArray = data.data;
      } else {
        throw new Error("Unexpected response format");
      }

      setContacts(contactsArray);
      setFilteredContacts(contactsArray);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setContacts([]);
      setFilteredContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Search effect
  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchTerm, contacts]);

  // Function to open contact details dialog
  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // Function to close contact details dialog
  const handleCloseDetails = () => {
    setSelectedContact(null);
  };

  // Delete contact
  const handleDeleteContact = async () => {
    if (!contactToDelete) return;

    try {
      const response = await fetch(`/api/contact?id=${contactToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      // Refresh contacts list
      await fetchContacts();
      toast.success("Deleted successfully!");
      // Reset delete state
      setContactToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        err instanceof Error
          ? `Delete failed: ${err.message}`
          : "An error occurred while deleting the contact"
      );
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-100">
        <p>Loading contact submissions...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div>
          <p>Error: {error}</p>
          {rawResponse && (
            <pre className="mt-4 p-4 bg-gray-800 text-white rounded">
              Raw Response: {JSON.stringify(rawResponse, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-neutral-900 border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white flex justify-between items-center">
              <div>
                Contact Form Submissions
                <span className="ml-4 text-base text-gray-400">
                  ({filteredContacts.length} total)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-neutral-800 text-white border-neutral-700"
                />
                <Search className="text-gray-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContacts.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No contact submissions found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-neutral-800">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow
                      key={contact._id}
                      className="border-gray-800 hover:bg-neutral-800 transition-colors"
                    >
                      <TableCell className="text-white">
                        {contact.name}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {contact.email}
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700"
                          onClick={() => handleViewDetails(contact)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-900 text-white hover:bg-red-800"
                          onClick={() => setContactToDelete(contact)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Contact Details Dialog */}
            {selectedContact && (
              <Dialog
                open={!!selectedContact}
                onOpenChange={handleCloseDetails}
              >
                <DialogContent className="bg-neutral-900 border-neutral-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Contact Submission Details
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Detailed information about the contact form submission
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 p-4 bg-black/30 rounded-lg">
                    <div>
                      <span className="text-gray-400 mr-2">Name:</span>
                      <span className="text-white">{selectedContact.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 mr-2">Email:</span>
                      <span className="text-white">
                        {selectedContact.email}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 mr-2">Message:</span>
                      <p className="text-gray-300 italic">
                        "{selectedContact.message}"
                      </p>
                    </div>
                    {selectedContact.createdAt && (
                      <div>
                        <span className="text-gray-400 mr-2">Submitted:</span>
                        <span className="text-white">
                          {formatDistanceToNow(
                            new Date(selectedContact.createdAt)
                          )}{" "}
                          ago
                        </span>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            {contactToDelete && (
              <Dialog
                open={!!contactToDelete}
                onOpenChange={() => setContactToDelete(null)}
              >
                <DialogContent className="bg-neutral-900 border-neutral-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Confirm Deletion
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Are you sure you want to delete this contact submission?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 p-4 bg-black/30 rounded-lg">
                    <p className="text-white">Name: {contactToDelete.name}</p>
                    <p className="text-gray-400">
                      Email: {contactToDelete.email}
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setContactToDelete(null)}
                      className="bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteContact}
                      className="bg-red-900 text-white hover:bg-red-800"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactAdminTable;
