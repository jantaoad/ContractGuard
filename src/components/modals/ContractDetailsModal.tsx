import React from 'react';
import { XCircle } from 'lucide-react';
import { Contract } from '@/types';

interface ContractDetailsModalProps {
  contract: Contract;
  onClose: () => void;
}

export const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({
  contract,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 md:p-6">
      <div className="bg-white rounded-t-2xl md:rounded-lg shadow-2xl w-full md:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between gap-3 z-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold truncate">{contract.fileName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <XCircle className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Key Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Type</p>
              <p className="font-semibold text-sm sm:text-base">{contract.contractType}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Vendor</p>
              <p className="font-semibold text-sm sm:text-base truncate">{contract.vendor}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Risk Level</p>
              <span
                className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                  contract.riskLevel === 'High'
                    ? 'bg-red-100 text-red-800'
                    : contract.riskLevel === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {contract.riskLevel} ({contract.riskScore}%)
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Compliance</p>
              <p className="font-semibold text-sm sm:text-base">{contract.overallComplianceScore}%</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
            <h3 className="font-semibold text-sm sm:text-base mb-2">AI Summary</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{contract.summary}</p>
          </div>

          {/* Risk Analysis */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base mb-3">Risk Analysis</h3>
            <div className="space-y-2">
              {contract.risks?.map((r, i) => (
                <div
                  key={i}
                  className="border-l-4 pl-3 sm:pl-4 py-2 sm:py-3"
                  style={{
                    borderColor:
                      r.severity === 'High'
                        ? '#ef4444'
                        : r.severity === 'Medium'
                          ? '#f59e0b'
                          : '#10b981',
                  }}
                >
                  <p className="font-semibold text-sm sm:text-base text-gray-900">{r.category}</p>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Renewal Date</p>
              <p className="font-semibold text-sm sm:text-base">{contract.renewalDate || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Auto-Renew</p>
              <p className="font-semibold text-sm sm:text-base">{contract.autoRenews ? 'Yes' : 'No'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Contract Value</p>
              <p className="font-semibold text-sm sm:text-base">{contract.value}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 sm:p-6 bg-white sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
