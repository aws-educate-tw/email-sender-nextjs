import React, { useState } from "react";
import { ArrowRight, Edit, Plus, Upload } from "lucide-react";

interface RecipientsProps {
  onNext: () => void;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
}

export const EmailServiceRecipients: React.FC<RecipientsProps> = ({ onNext }) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const addRecipient = () => {
    if (newName && newEmail) {
      setRecipients([...recipients, { id: Date.now().toString(), name: newName, email: newEmail }]);
      setNewName("");
      setNewEmail("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-2xl font-bold flex items-center">
          Create Recipients Sheet <Edit className="ml-2 w-5 h-5" />
        </h2>
        <button className="bg-white border border-gray-300 rounded px-4 py-2 flex items-center">
          <Upload className="mr-2 w-4 h-4" /> Import Sheet
        </button>
      </div>

      <div className="px-6 pb-2">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <span className="text-gray-400">::</span>
          </div>
          <input
            type="text"
            className="w-22 p-3 border border-gray-300 rounded padding-0"
            placeholder="Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <div className="flex items-center px-2">
            <span className="text-gray-400">::</span>
          </div>
          <input
            type="email"
            className="w-44 p-3 border border-gray-300 rounded"
            placeholder="Email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
          <button
            className="p-3 border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
            onClick={addRecipient}
          >
            <Plus />
          </button>
          <button
            className="bg-[#1a2f4a] text-white px-4 py-2 rounded flex items-center"
            onClick={addRecipient}
          >
            <Plus className="mr-2 w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200 font-medium">
          <div className="col-span-5">Name</div>
          <div className="col-span-5">Email</div>
          <div className="col-span-2">Action</div>
        </div>

        {recipients.map(recipient => (
          <div key={recipient.id} className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200">
            <div className="col-span-5">{recipient.name}</div>
            <div className="col-span-5">{recipient.email}</div>
            <div className="col-span-2">
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  setRecipients(recipients.filter(r => r.id !== recipient.id));
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {recipients.length === 0 && (
          <div className="py-4 text-center text-gray-500">No recipients added yet</div>
        )}
      </div>

      <div className="flex justify-end p-6">
        <button
          className="px-6 py-2 rounded flex items-center bg-[#1a2f4a] text-white hover:bg-[#2c4a72]"
          onClick={onNext}
        >
          Next <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
