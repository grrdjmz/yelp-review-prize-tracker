"use client";

import { useState, useMemo } from 'react';
import { AvatarInitials } from './AvatarInitials';

export interface Staff {
  id: string;
  full_name: string;
  active: boolean;
  avatar_url?: string | null;
}

interface StaffGridProps {
  staff: Staff[];
}

export default function StaffGrid({ staff }: StaffGridProps) {
  const [query, setQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const filtered = useMemo(() => {
    return staff.filter((s) => {
      const match = s.full_name.toLowerCase().includes(query.toLowerCase());
      const show = showInactive || s.active;
      return match && show;
    });
  }, [staff, query, showInactive]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search staff..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-bc-gray/30 rounded-md px-3 py-2 flex-1"
        />
        <label className="inline-flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="h-4 w-4 text-bc-blue border-bc-gray rounded"
          />
          <span>Show inactive</span>
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((person) => (
          <div
            key={person.id}
            className="bg-white shadow-card rounded-xl2 p-4 flex flex-col items-center text-center"
          >
            <AvatarInitials fullName={person.full_name} avatarUrl={person.avatar_url || undefined} size={80} />
            <div className="mt-2 font-medium text-bc-black">{person.full_name}</div>
            {!person.active && (
              <span className="mt-1 text-xs bg-bc-gray/10 text-bc-gray px-2 py-0.5 rounded-full">
                Inactive
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
