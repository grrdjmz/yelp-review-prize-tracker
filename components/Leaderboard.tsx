"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export type LeaderboardEntry = {
  staff_id: string;
  full_name: string;
  review_count: number;
};

export interface LeaderboardData {
  all_time: LeaderboardEntry[];
  this_month: LeaderboardEntry[];
  this_week: LeaderboardEntry[];
}

interface LeaderboardProps {
  data: LeaderboardData;
}

const tabs = [
  { key: 'all_time', label: 'All‑Time' },
  { key: 'this_month', label: 'This Month' },
  { key: 'this_week', label: 'This Week' },
] as const;

export default function Leaderboard({ data }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['key']>('all_time');

  const current = data[activeTab] || [];

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      <div className="flex justify-center space-x-2">{
        tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx('px-3 py-1 rounded-full text-sm font-medium', {
              'bg-bc-red text-white': activeTab === tab.key,
              'bg-bc-gray/10 text-bc-gray hover:bg-bc-gray/20': activeTab !== tab.key,
            })}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-bc-gray/20">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-sm font-semibold text-bc-gray">Rank</th>
              <th className="px-3 py-2 text-left text-sm font-semibold text-bc-gray">Name</th>
              <th className="px-3 py-2 text-right text-sm font-semibold text-bc-gray">Reviews</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bc-gray/10">
            {current.map((entry, idx) => {
              const rank = idx + 1;
              let accent = '';
              if (rank === 1) accent = 'text-bc-gold underline underline-offset-4';
              else if (rank === 2) accent = 'border-l-4 border-bc-gray pl-1';
              else if (rank === 3) accent = 'bg-bc-bronze/10 text-bc-bronze px-1 py-0.5 rounded-full';
              return (
                <tr key={entry.staff_id} className="hover:bg-bc-gray/5">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={clsx('font-bold', accent)}>{rank}</span>
                  </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {entry.full_name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right">
                      {/* animate count */}
                      <AnimatePresence initial={false} mode="wait">
                        <motion.span
                          key={entry.review_count}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.3 }}
                          className="text-bc-red font-semibold"
                        >
                          {entry.review_count}
                        </motion.span>
                      </AnimatePresence>
                    </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
