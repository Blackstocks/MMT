"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export const GSTDetails = () => {
  const [showGSTForm, setShowGSTForm] = useState(false);

  const states = [
    "Delhi",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Uttar Pradesh",
    // Add more states
  ];

  return (
    <Card className="mb-4">
      <div className="p-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Your State</h3>
          <p className="text-gray-500 text-sm mb-2">
            Required for GST purpose on your tax invoice. You can edit this anytime later in your profile section.
          </p>
          <select className="w-full p-2 border rounded-md bg-white">
            <option value="">Select the State</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {showGSTForm && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">GST Number</label>
              <Input placeholder="Enter GST Number" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Company Name</label>
              <Input placeholder="Enter Company Name" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Company Address</label>
              <Input placeholder="Enter Company Address" />
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="flex items-center gap-2">
            <Checkbox onChange={(e) => setShowGSTForm(e.target.checked)} />
            <span>Confirm and save billing details to your profile</span>
          </label>
        </div>
      </div>
    </Card>
  );
};