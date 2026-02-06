import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, iconColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-2">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-gray-600 font-medium">{title}</p>
    </div>
  );
};
