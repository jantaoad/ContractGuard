import React from 'react';
import { Contract } from '@/types';
import { ChevronRight } from 'lucide-react';

interface ContractTableProps {
  contracts: Contract[];
  onSelectContract: (contract: Contract) => void;
}

export const ContractTable: React.FC<ContractTableProps> = ({ contracts, onSelectContract }) => {
  if (contracts.length === 0) {
    return null;
  }

  // Mobile card view
  const MobileView = () => (
    <div className="space-y-3">
      {contracts.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelectContract(c)}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{c.fileName}</p>
              <p className="text-sm text-gray-600">{c.vendor}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                c.riskLevel === 'High'
                  ? 'bg-red-100 text-red-800'
                  : c.riskLevel === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}
            >
              {c.riskLevel} Risk
            </span>
            <span className="text-gray-600">{c.renewalDate || 'No renewal'}</span>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop table view
  const DesktopView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Vendor
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Risk
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Renewal
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {contracts.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{c.fileName}</td>
              <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{c.vendor}</td>
              <td className="px-4 sm:px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    c.riskLevel === 'High'
                      ? 'bg-red-100 text-red-800'
                      : c.riskLevel === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {c.riskLevel}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{c.renewalDate || 'N/A'}</td>
              <td className="px-4 sm:px-6 py-4">
                <button
                  onClick={() => onSelectContract(c)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6 sm:mb-8">
      <div className="px-4 sm:px-6 py-4 border-b bg-white">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          All Contracts {contracts.length > 0 && `(${contracts.length})`}
        </h3>
      </div>
      {/* Mobile view */}
      <div className="md:hidden p-4">
        <MobileView />
      </div>
      {/* Desktop view */}
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </div>
  );
};
