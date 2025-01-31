import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Contact } from "@/types/invoice";

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
  });
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contacts</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Contact</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
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
                    setNewContact({ ...newContact, companyName: e.target.value })
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
              <Button onClick={saveContact} className="w-full">
                Save Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {contacts.map((contact) => (
          <Button
            key={contact.id}
            variant="outline"
            className="flex flex-col items-start p-4 h-auto"
            onClick={() => handleSelectContact(contact)}
          >
            <div className="font-medium">{contact.name}</div>
            {contact.companyName && (
              <div className="text-sm text-gray-500">{contact.companyName}</div>
            )}
            <div className="text-sm text-gray-500">{contact.address}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}
