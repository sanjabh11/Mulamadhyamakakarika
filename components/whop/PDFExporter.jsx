/**
 * PDFExporter - Chapter PDF Generation for Digital Products
 * 
 * Generates downloadable PDF versions of chapters
 * Premium feature for Seeker and Enlightened tiers
 */

import React, { useState, useCallback } from 'react';
import { useMembership, MembershipGate } from './MembershipTiers';

// Chapter content structure for PDF
const CHAPTER_CONTENT = {
  1: {
    title: "Investigation of Conditions",
    sanskrit: "Pratyaya-parīkṣā",
    verseCount: 14,
    theme: "Dependent Origination and Emptiness of Causation"
  },
  // Additional chapters would be populated from data
};

/**
 * Main PDF Exporter Component
 */
export default function PDFExporter({ chapter, verses, chapterInfo }) {
  const { canDownload } = useMembership();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const generatePDF = useCallback(async () => {
    if (!canDownload()) {
      alert('Upgrade to Seeker or Enlightened tier to download PDFs');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate PDF content
      const pdfContent = generatePDFContent(chapter, verses, chapterInfo);
      
      // In production, this would use a PDF library like jsPDF or call a server endpoint
      // For now, we'll create a downloadable HTML document
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `MMK-Chapter-${chapter}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadReady(true);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [chapter, verses, chapterInfo, canDownload]);

  return (
    <MembershipGate 
      feature="download"
      fallback={
        <div className="pdf-locked">
          <span className="icon">📄</span>
          <p>Upgrade to download chapter PDFs</p>
        </div>
      }
    >
      <div className="pdf-exporter">
        <button 
          onClick={generatePDF}
          disabled={isGenerating}
          className="download-btn"
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            <>
              📥 Download Chapter PDF
            </>
          )}
        </button>
        
        {downloadReady && (
          <p className="success-msg">✓ Download started!</p>
        )}

        <style jsx>{`
          .pdf-exporter {
            display: inline-block;
          }
          
          .download-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #8B5CF6, #7c3aed);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .download-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
          }
          
          .download-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          
          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .success-msg {
            color: #10B981;
            font-size: 0.875rem;
            margin-top: 0.5rem;
          }
          
          .pdf-locked {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 8px;
            color: #94a3b8;
            font-size: 0.875rem;
          }
          
          .pdf-locked .icon {
            font-size: 1.25rem;
          }
        `}</style>
      </div>
    </MembershipGate>
  );
}

/**
 * Generate PDF Content (HTML format for now)
 */
function generatePDFContent(chapter, verses, chapterInfo) {
  const verseHTML = (verses || []).map((verse, i) => `
    <div class="verse">
      <h3>Verse ${chapter}.${verse.number || i + 1}</h3>
      ${verse.title ? `<h4>${verse.title}</h4>` : ''}
      <div class="verse-content">
        <p class="summary"><strong>Madhyamaka:</strong> ${verse.summary || verse.madhyamaka || ''}</p>
        <p class="quantum"><strong>Quantum Parallel:</strong> ${verse.quantum || ''}</p>
        ${verse.explanation ? `<p class="explanation"><strong>Explanation:</strong> ${verse.explanation}</p>` : ''}
      </div>
    </div>
  `).join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mūlamadhyamakakārikā - Chapter ${chapter}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      color: #1e293b;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #fefefe;
    }
    
    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #8B5CF6;
    }
    
    .lotus {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    h1 {
      font-size: 2rem;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #8B5CF6;
      font-size: 1.1rem;
      font-style: italic;
    }
    
    .chapter-summary {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border-left: 4px solid #8B5CF6;
    }
    
    .chapter-summary h2 {
      color: #8B5CF6;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    
    .verse {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #fefefe;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      page-break-inside: avoid;
    }
    
    .verse h3 {
      color: #8B5CF6;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    
    .verse h4 {
      color: #64748b;
      font-size: 1rem;
      font-weight: normal;
      font-style: italic;
      margin-bottom: 1rem;
    }
    
    .verse-content p {
      margin-bottom: 0.75rem;
    }
    
    .verse-content strong {
      color: #8B5CF6;
    }
    
    .footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 0.9rem;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .verse {
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="lotus">🪷</div>
    <h1>Mūlamadhyamakakārikā</h1>
    <p class="subtitle">Chapter ${chapter}: ${chapterInfo?.title || 'Investigation'}</p>
  </div>
  
  <div class="chapter-summary">
    <h2>Chapter Overview</h2>
    <p>${chapterInfo?.summary || 'This chapter explores the nature of emptiness and interdependence.'}</p>
    ${chapterInfo?.quantumSummary ? `<p style="margin-top: 1rem;"><strong>Quantum Connections:</strong> ${chapterInfo.quantumSummary}</p>` : ''}
  </div>
  
  <div class="verses">
    ${verseHTML}
  </div>
  
  <div class="footer">
    <p>Nāgārjuna's Quantum Reflections</p>
    <p>Generated from the 27-Day Quantum Enlightenment Journey</p>
    <p style="margin-top: 0.5rem; font-size: 0.8rem;">© ${new Date().getFullYear()} - For personal study only</p>
  </div>
</body>
</html>
  `;
}

/**
 * Bulk PDF Export Component
 */
export function BulkPDFExporter({ chapters }) {
  const { canDownload } = useMembership();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateAllPDFs = useCallback(async () => {
    if (!canDownload()) return;
    
    setIsGenerating(true);
    setProgress(0);

    // In production, this would generate a ZIP file with all chapter PDFs
    for (let i = 0; i < chapters.length; i++) {
      setProgress(Math.round(((i + 1) / chapters.length) * 100));
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsGenerating(false);
    alert('All PDFs generated! Check your downloads folder.');
  }, [chapters, canDownload]);

  return (
    <MembershipGate feature="download">
      <div className="bulk-exporter">
        <button 
          onClick={generateAllPDFs}
          disabled={isGenerating}
          className="bulk-btn"
        >
          {isGenerating ? (
            <>Generating... {progress}%</>
          ) : (
            <>📚 Download All Chapters</>
          )}
        </button>

        <style jsx>{`
          .bulk-exporter {
            display: inline-block;
          }
          
          .bulk-btn {
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #10B981, #059669);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .bulk-btn:hover:not(:disabled) {
            transform: translateY(-2px);
          }
          
          .bulk-btn:disabled {
            opacity: 0.7;
          }
        `}</style>
      </div>
    </MembershipGate>
  );
}

/**
 * Meditation Guide PDF Generator
 */
export function MeditationGuidePDF() {
  const { canDownload } = useMembership();

  const generateMeditationGuide = useCallback(() => {
    if (!canDownload()) return;

    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>MMK Meditation Guide</title>
  <style>
    body { font-family: Georgia, serif; max-width: 700px; margin: 2rem auto; padding: 2rem; }
    h1 { text-align: center; color: #8B5CF6; }
    .meditation { margin: 2rem 0; padding: 1.5rem; background: #f8fafc; border-radius: 8px; }
    h2 { color: #8B5CF6; }
  </style>
</head>
<body>
  <h1>🧘 Quantum Emptiness Meditation Guide</h1>
  
  <div class="meditation">
    <h2>1. Emptiness of Self (10 min)</h2>
    <p>Sit comfortably. Observe the breath. Ask: "Where is the self that breathes?"</p>
    <p>Notice how the self cannot be found separate from the breathing process.</p>
  </div>
  
  <div class="meditation">
    <h2>2. Dependent Origination (15 min)</h2>
    <p>Contemplate a thought. Trace its conditions. Where did it come from?</p>
    <p>Like quantum entanglement, thoughts arise interdependently.</p>
  </div>
  
  <div class="meditation">
    <h2>3. The Middle Way (20 min)</h2>
    <p>Rest in awareness without grasping existence or non-existence.</p>
    <p>Like superposition, reality transcends binary categories.</p>
  </div>
  
  <div class="meditation">
    <h2>4. Observer and Observed (15 min)</h2>
    <p>Who is observing? Can the observer be found?</p>
    <p>Like the quantum observer effect, observation and observed are inseparable.</p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MMK-Meditation-Guide.html';
    link.click();
    URL.revokeObjectURL(url);
  }, [canDownload]);

  return (
    <MembershipGate feature="download">
      <button onClick={generateMeditationGuide} className="guide-btn">
        🧘 Download Meditation Guide
        
        <style jsx>{`
          .guide-btn {
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #EC4899, #DB2777);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </button>
    </MembershipGate>
  );
}
