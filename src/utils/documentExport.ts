import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

// Generate PDF from an HTML element
export async function generatePDF(
  element: HTMLElement,
  fileName: string = 'report.pdf'
): Promise<string> {
  // Create a canvas from the element
  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Calculate dimensions
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // Add the image to the PDF (first page)
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add additional pages if content overflows
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Save the PDF
  pdf.save(fileName);
  return fileName;
}

// Generate DOCX from content
export async function generateDOCX(
  content: string,
  fileName: string = 'report.docx'
): Promise<string> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: parseContentToDocxElements(content)
    }],
  });

  // Generate blob and save using file-saver
  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
  return fileName;
}

// Helper function to parse markdown-like content into DOCX elements
function parseContentToDocxElements(content: string): Paragraph[] {
  const lines = content.split('\n');
  const elements: Paragraph[] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      elements.push(new Paragraph({ spacing: { after: 200 } }));
      continue;
    }

    // Handle headers
    if (line.startsWith('# ')) {
      elements.push(new Paragraph({
        text: line.substring(2),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }));
    } else if (line.startsWith('## ')) {
      elements.push(new Paragraph({
        text: line.substring(3),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 }
      }));
    } else if (line.startsWith('### ')) {
      elements.push(new Paragraph({
        text: line.substring(4),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 200 }
      }));
    }
    // Handle bullet points
    else if (line.startsWith('- ')) {
      elements.push(new Paragraph({
        children: [
          new TextRun('• '),
          new TextRun(line.substring(2))
        ],
        spacing: { before: 100, after: 100 },
        indent: { left: 720 } // 0.5 inch indent
      }));
    }
    // Regular paragraph
    else {
      elements.push(new Paragraph({
        text: line,
        spacing: { before: 100, after: 100 }
      }));
    }
  }

  return elements;
}

export type ExportFormat = 'pdf' | 'docx';

// Unified export function that handles both formats
export async function exportDocument(
  element: HTMLElement,
  content: string,
  format: ExportFormat,
  fileName: string
): Promise<string> {
  const baseFileName = fileName.replace(/\.(pdf|docx)$/, '');
  
  if (format === 'pdf') {
    return generatePDF(element, `${baseFileName}.pdf`);
  } else {
    return generateDOCX(content, `${baseFileName}.docx`);
  }
}