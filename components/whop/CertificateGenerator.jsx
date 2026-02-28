/**
 * CertificateGenerator - Completion Certificate for Whop Course
 * 
 * Generates beautiful certificates for quiz/chapter completion
 * Client-side rendering with download capability
 */

import React, { useRef, useCallback } from 'react';

/**
 * Certificate Component
 */
export default function CertificateGenerator({
  userName = 'Spiritual Seeker',
  chapterNumber,
  chapterTitle,
  score,
  totalQuestions,
  completedAt,
  certificateId
}) {
  const certificateRef = useRef(null);
  
  const percentage = Math.round((score / totalQuestions) * 100);
  const formattedDate = new Date(completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generate unique certificate ID
  const certId = certificateId || `MMK-${chapterNumber}-${Date.now().toString(36).toUpperCase()}`;

  // Download certificate as image
  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;
    
    try {
      // Use html2canvas if available, otherwise show print dialog
      if (typeof window !== 'undefined' && window.html2canvas) {
        const canvas = await window.html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#0f172a'
        });
        const link = document.createElement('a');
        link.download = `MMK-Certificate-Chapter-${chapterNumber}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        window.print();
      }
    } catch (error) {
      console.error('Download failed:', error);
      window.print();
    }
  }, [chapterNumber]);

  // Share certificate
  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Mūlamadhyamakakārikā Certificate',
      text: `I completed Chapter ${chapterNumber}: ${chapterTitle} with ${percentage}% score! 🎓`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
      alert('Certificate link copied to clipboard!');
    }
  }, [chapterNumber, chapterTitle, percentage]);

  return (
    <div className="certificate-wrapper">
      {/* Certificate Display */}
      <div ref={certificateRef} className="certificate">
        {/* Header */}
        <div className="certificate-header">
          <div className="lotus-icon">🪷</div>
          <h1>Certificate of Completion</h1>
          <div className="subtitle">Mūlamadhyamakakārikā Quantum Journey</div>
        </div>
        
        {/* Decorative Border */}
        <div className="ornament top-left">☸</div>
        <div className="ornament top-right">☸</div>
        <div className="ornament bottom-left">☸</div>
        <div className="ornament bottom-right">☸</div>
        
        {/* Main Content */}
        <div className="certificate-body">
          <p className="presented-to">This is to certify that</p>
          <h2 className="recipient-name">{userName}</h2>
          <p className="has-completed">has successfully completed</p>
          
          <div className="chapter-info">
            <h3>Chapter {chapterNumber}</h3>
            <p>{chapterTitle}</p>
          </div>
          
          <div className="score-badge">
            <span className="score">{percentage}%</span>
            <span className="label">Score</span>
          </div>
          
          <p className="achievement">
            Demonstrating understanding of Nāgārjuna's profound insights
            on emptiness, interdependence, and the nature of reality
            through the lens of quantum physics.
          </p>
        </div>
        
        {/* Footer */}
        <div className="certificate-footer">
          <div className="signature">
            <div className="signature-line"></div>
            <p>Nāgārjuna's Quantum Reflections</p>
          </div>
          <div className="date-info">
            <p className="date">{formattedDate}</p>
            <p className="cert-id">Certificate ID: {certId}</p>
          </div>
        </div>
        
        {/* Quantum Pattern Background */}
        <div className="quantum-pattern"></div>
      </div>
      
      {/* Actions */}
      <div className="certificate-actions">
        <button onClick={handleDownload} className="download-btn">
          📥 Download Certificate
        </button>
        <button onClick={handleShare} className="share-btn">
          📤 Share Achievement
        </button>
      </div>
      
      <style jsx>{`
        .certificate-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
        }
        
        .certificate {
          position: relative;
          width: 100%;
          max-width: 700px;
          padding: 3rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e1e2e 50%, #0f172a 100%);
          border: 3px solid #8B5CF6;
          border-radius: 16px;
          box-shadow: 
            0 0 30px rgba(139, 92, 246, 0.3),
            inset 0 0 60px rgba(139, 92, 246, 0.05);
          overflow: hidden;
        }
        
        .quantum-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .ornament {
          position: absolute;
          font-size: 1.5rem;
          color: rgba(139, 92, 246, 0.4);
        }
        
        .top-left { top: 1rem; left: 1rem; }
        .top-right { top: 1rem; right: 1rem; }
        .bottom-left { bottom: 1rem; left: 1rem; }
        .bottom-right { bottom: 1rem; right: 1rem; }
        
        .certificate-header {
          text-align: center;
          position: relative;
          z-index: 1;
          margin-bottom: 2rem;
        }
        
        .lotus-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        
        .certificate-header h1 {
          font-size: 2rem;
          font-weight: 300;
          color: #e2e8f0;
          letter-spacing: 0.1em;
          margin: 0;
        }
        
        .subtitle {
          color: #8B5CF6;
          font-size: 0.9rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-top: 0.5rem;
        }
        
        .certificate-body {
          text-align: center;
          position: relative;
          z-index: 1;
        }
        
        .presented-to {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .recipient-name {
          font-size: 2.5rem;
          font-weight: 300;
          color: #e2e8f0;
          font-style: italic;
          margin: 0.5rem 0 1rem;
          border-bottom: 1px solid rgba(139, 92, 246, 0.3);
          padding-bottom: 0.5rem;
        }
        
        .has-completed {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .chapter-info {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1.5rem auto;
          max-width: 400px;
        }
        
        .chapter-info h3 {
          color: #8B5CF6;
          font-size: 1.5rem;
          margin: 0 0 0.5rem;
        }
        
        .chapter-info p {
          color: #e2e8f0;
          margin: 0;
          font-size: 1.1rem;
        }
        
        .score-badge {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          padding: 1rem 2rem;
          border-radius: 12px;
          margin: 1.5rem 0;
        }
        
        .score {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }
        
        .score-badge .label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .achievement {
          color: #94a3b8;
          font-size: 0.85rem;
          line-height: 1.6;
          max-width: 500px;
          margin: 1.5rem auto;
          font-style: italic;
        }
        
        .certificate-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(139, 92, 246, 0.2);
          position: relative;
          z-index: 1;
        }
        
        .signature {
          text-align: center;
        }
        
        .signature-line {
          width: 150px;
          height: 1px;
          background: rgba(139, 92, 246, 0.5);
          margin-bottom: 0.5rem;
        }
        
        .signature p {
          color: #8B5CF6;
          font-size: 0.75rem;
          margin: 0;
        }
        
        .date-info {
          text-align: right;
        }
        
        .date {
          color: #e2e8f0;
          font-size: 0.9rem;
          margin: 0 0 0.25rem;
        }
        
        .cert-id {
          color: #64748b;
          font-size: 0.7rem;
          margin: 0;
          font-family: monospace;
        }
        
        .certificate-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .download-btn, .share-btn {
          padding: 0.875rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .download-btn {
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          border: none;
          color: white;
        }
        
        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        
        .share-btn {
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.4);
          color: #e2e8f0;
        }
        
        .share-btn:hover {
          background: rgba(139, 92, 246, 0.3);
        }
        
        @media (max-width: 600px) {
          .certificate {
            padding: 2rem 1.5rem;
          }
          
          .certificate-header h1 {
            font-size: 1.5rem;
          }
          
          .recipient-name {
            font-size: 1.75rem;
          }
          
          .certificate-footer {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .date-info {
            text-align: center;
          }
        }
        
        @media print {
          .certificate-actions {
            display: none;
          }
          
          .certificate {
            box-shadow: none;
            border: 2px solid #8B5CF6;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Generate certificate data for a completed chapter
 */
export function generateCertificateData(chapter, quizResult, userName) {
  return {
    userName: userName || 'Spiritual Seeker',
    chapterNumber: chapter,
    chapterTitle: getChapterTitle(chapter),
    score: quizResult.score,
    totalQuestions: quizResult.total,
    completedAt: new Date().toISOString(),
    certificateId: `MMK-${chapter}-${Date.now().toString(36).toUpperCase()}`
  };
}

/**
 * Get chapter title by number
 */
function getChapterTitle(chapter) {
  const titles = {
    1: "Investigation of Conditions",
    2: "Examination of Motion",
    3: "Examination of Perception",
    4: "Examination of Aggregates",
    5: "Examination of Elements",
    6: "Examination of Desire",
    7: "Examination of Arising",
    8: "Examination of Agent and Action",
    9: "Examination of the Prior Entity",
    10: "Examination of Fire and Fuel",
    11: "Examination of Prior and Posterior Limits",
    12: "Examination of Suffering",
    13: "Examination of Compounded Phenomena",
    14: "Examination of Association",
    15: "Examination of Essence",
    16: "Examination of Bondage and Liberation",
    17: "Examination of Action and Fruit",
    18: "Examination of Self and Phenomena",
    19: "Examination of Time",
    20: "Examination of Cause and Effect",
    21: "Examination of Becoming and Destruction",
    22: "Examination of the Tathāgata",
    23: "Examination of Error",
    24: "Examination of the Noble Truths",
    25: "Examination of Nirvāṇa",
    26: "Examination of the Twelve Links",
    27: "Examination of Views"
  };
  return titles[chapter] || `Chapter ${chapter}`;
}

/**
 * Full Course Certificate Component
 */
export function FullCourseCertificate({ userName, completedAt, overallScore }) {
  return (
    <CertificateGenerator
      userName={userName}
      chapterNumber="All"
      chapterTitle="Complete 27-Chapter Journey"
      score={overallScore}
      totalQuestions={100}
      completedAt={completedAt}
      certificateId={`MMK-FULL-${Date.now().toString(36).toUpperCase()}`}
    />
  );
}
