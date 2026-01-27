import { useState, useRef, type ChangeEvent } from 'react';
import { uploadFiles, type UploadResponse } from '../services/api';

interface FileUploadProps {
  onUploadComplete: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await uploadFiles(files);
      setUploadResult(result);
      onUploadComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Event Files</h2>

      <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          accept=".log,.txt,.csv,*"
        />

        {isUploading ? (
          <p className="text-gray-600">Uploading files...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">Drop event files here or click to browse</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary"
            >
              Select Files
            </button>
          </div>
        )}
      </div>

      {uploadResult && uploadResult.success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
          <p className="font-medium">{uploadResult.message}</p>
          <p className="text-sm mt-1">Files: {uploadResult.files_uploaded.join(', ')}</p>
          <p className="text-sm">Total event files: {uploadResult.total_files}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
