import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { UploadedDocument } from '../types';

interface DocumentUploadProps {
  onDocumentUpload: (document: UploadedDocument) => void;
  onDocumentRemove: (documentId: string) => void;
  documents: UploadedDocument[];
  className?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentUpload,
  onDocumentRemove,
  documents,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of files) {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const content = event.target?.result as string;
          const document: UploadedDocument = {
            id: crypto.randomUUID(),
            name: file.name,
            content: content,
            type: 'other',
          };
          onDocumentUpload(document);
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }

    setIsUploading(false);
    e.target.value = ''; // Reset input
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors">
          <Upload className="w-8 h-8 text-primary-600" />
          <span className="mt-2 text-base">Upload documents</span>
          <span className="text-sm text-neutral-500">PDF, TXT, DOC up to 10MB</span>
          <input
            type="file"
            className="hidden"
            multiple
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
            >
              <span className="text-sm truncate flex-1">{doc.name}</span>
              <button
                onClick={() => onDocumentRemove(doc.id)}
                className="ml-2 text-neutral-500 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;