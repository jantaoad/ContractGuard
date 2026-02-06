import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { BarChartData } from '@/types';

interface ContractPerformanceChartProps {
  data: BarChartData[];
}

export const ContractPerformanceChart: React.FC<ContractPerformanceChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Contract Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="risk" fill="#f59e0b" name="Risk" />
          <Bar dataKey="comp" fill="#10b981" name="Compliance" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
