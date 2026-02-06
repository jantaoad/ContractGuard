import React from 'react';
import { PieChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChartData } from '@/types';

interface RiskDistributionChartProps {
  data: PieChartData[];
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <PieChart className="w-6 h-6 text-indigo-600" />
        Risk Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, value }) => `${name}: ${value}`}
            dataKey="value"
          >
            {data.map((e, i) => (
              <Cell key={i} fill={e.color} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};
