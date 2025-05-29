import React, { useRef, useState } from 'react';
import { Download, XCircle } from 'lucide-react';
import { exportDocument, ExportFormat } from '../utils/documentExport';

interface ReportViewerProps {
  title: string;
  content: string;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ title, content, onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');

  const handleDownload = async () => {
    if (reportRef.current) {
      const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.${exportFormat}`;
      await exportDocument(reportRef.current, content, exportFormat, fileName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-primary-800">{title}</h2>
          <div className="flex space-x-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              className="px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
            </select>
            <button
              onClick={handleDownload}
              className="p-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              title={`Download as ${exportFormat.toUpperCase()}`}
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-700 transition-colors"
              title="Close"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <div 
            ref={reportRef}
            className="bg-white p-8 report-content"
          >
            <h1 className="text-2xl font-bold mb-6 text-primary-800">{title}</h1>
            <div className="prose max-w-none">
              {content.split('\n').map((paragraph, index) => {
                // Handle headers
                if (paragraph.startsWith('# ')) {
                  return <h2 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.substring(2)}</h2>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h3 key={index} className="text-lg font-semibold mt-5 mb-2">{paragraph.substring(3)}</h3>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h4 key={index} className="text-base font-semibold mt-4 mb-2">{paragraph.substring(4)}</h4>;
                }
                
                // Handle bullet points
                if (paragraph.startsWith('- ')) {
                  return <li key={index} className="ml-4">{paragraph.substring(2)}</li>;
                }
                
                // Regular paragraph
                return paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;