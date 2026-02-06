import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { contractService } from '@/services/contractService';
import { validateFile as validateFileUtil } from '@/utils/validationUtils';

interface ContractUploadProps {
  onUploadSuccess: () => void;
  onError: (error: string) => void;
  uploading: boolean;
  onUploadStart: () => void;
  onUploadEnd: () => void;
}

export const ContractUpload: React.FC<ContractUploadProps> = ({
  onUploadSuccess,
  onError,
  uploading,
  onUploadStart,
  onUploadEnd,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file using validation utilities
    const validationError = validateFileUtil(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    });

    if (validationError) {
      setValidationError(validationError);
      onError(validationError);
      return;
    }

    setValidationError(null);

    onUploadStart();
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      await contractService.uploadAndAnalyzeContract(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onUploadSuccess();
        setUploadProgress(0);
      }, 500);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      onUploadEnd();
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Upload New Contract</h3>

      {validationError && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2 text-yellow-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center hover:border-indigo-400 transition-colors">
        <input
          type="file"
          id="f"
          className="hidden"
          accept=".pdf,.txt,.docx"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <label htmlFor="f" className={`cursor-pointer block ${uploading ? 'opacity-60' : ''}`}>
          {uploading ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-base sm:text-lg font-medium">Analyzing contract...</p>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              <p className="text-xs sm:text-sm text-gray-500">
                {uploadProgress > 0 ? `${Math.round(uploadProgress)}% complete` : 'Processing...'}
              </p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium">Click to upload or drag and drop</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">PDF, TXT, DOCX (Max 10MB)</p>
            </>
          )}
        </label>
      </div>

      <div className="mt-3 sm:mt-4 text-xs text-gray-500">
        <p>💡 Tip: Upload contracts for instant AI analysis including risk assessment, clause extraction, and renewal tracking.</p>
      </div>
    </div>
  );
};
