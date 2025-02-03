import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Contact } from "@/types/invoice";
import { Plus, X } from "lucide-react";

interface ContactsManagerProps {
  onSelectContact: (contact: Contact) => void;
}

export function ContactsManager({ onSelectContact }: ContactsManagerProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState<Contact>({
    id: "",
    name: "",
    companyName: "",
    address: "",
    email: "",
    phone: "",
    currency: "$",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  useEffect(() => {
    const savedContacts = localStorage.getItem("contacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const saveContact = () => {
    const updatedContact = {
      ...newContact,
      id: crypto.randomUUID(),
    };
    const updatedContacts = [...contacts, updatedContact];
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    setNewContact({
      id: "",
      name: "",
      companyName: "",
      address: "",
      email: "",
      phone: "",
    });
    setIsOpen(false);
  };

  const handleSelectContact = (contact: Contact) => {
    onSelectContact(contact);
  };

  const handleDeleteClick = (e: React.MouseEvent, contact: Contact) => {
    e.stopPropagation();
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const deleteContact = () => {
    if (contactToDelete) {
      const updatedContacts = contacts.filter(
        (c) => c.id !== contactToDelete.id
      );
      setContacts(updatedContacts);
      localStorage.setItem("contacts", JSON.stringify(updatedContacts));
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Client Addresses</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <h3 className="text-lg font-semibold">Add New Client</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the client details below to add them to your address
                  book.
                </p>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={newContact.companyName}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        companyName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={newContact.address}
                    onChange={(e) =>
                      setNewContact({ ...newContact, address: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newContact.currency}
                    onChange={(e) =>
                      setNewContact({ ...newContact, currency: e.target.value })
                    }
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="¥">JPY (¥)</option>
                    <option value="₹">INR (₹)</option>
                    <option value="A$">AUD (A$)</option>
                    <option value="C$">CAD (C$)</option>
                    <option value="CHF">CHF (CHF)</option>
                  </select>
                </div>
                <Button onClick={saveContact} className="w-full">
                  Save Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 hover:text-accent-foreground transition-colors"
              onClick={() => handleSelectContact(contact)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{contact.name}</div>
                  {contact.companyName && (
                    <div className="text-sm text-muted-foreground">
                      {contact.companyName}
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => handleDeleteClick(e, contact)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h3 className="text-lg font-semibold">Delete Contact</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete {contactToDelete?.name}? This
              action cannot be undone.
            </p>
          </DialogHeader>
          <div className="flex justify-end gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteContact}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
