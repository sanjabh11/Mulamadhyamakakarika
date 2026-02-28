/**
 * Bookmark Button Component
 * CRITICAL: Engagement feature for saving favorite verses
 */

import React, { useState, useEffect } from 'react';
import { toggleBookmark, isBookmarked } from '../lib/user-progress';
import { useUser } from '../contexts/UserContext';
import { track, EVENTS } from '../lib/analytics';

export default function BookmarkButton({ chapter, verse, size = 'medium' }) {
  const { user } = useUser();
  const [bookmarked, setBookmarked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(chapter, verse, user?.id));
  }, [chapter, verse, user?.id]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = toggleBookmark(chapter, verse, user?.id);
    setBookmarked(newState);
    setAnimating(true);
    
    setTimeout(() => setAnimating(false), 300);

    track(newState ? EVENTS.UPGRADE_CTA_CLICKED : 'bookmark_removed', {
      chapter,
      verse,
      action: newState ? 'added' : 'removed'
    });
  };

  const sizeClasses = {
    small: { width: 20, height: 20, padding: '4px' },
    medium: { width: 24, height: 24, padding: '6px' },
    large: { width: 32, height: 32, padding: '8px' }
  };

  const { width, height, padding } = sizeClasses[size] || sizeClasses.medium;

  return (
    <button
      onClick={handleClick}
      className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''} ${animating ? 'animating' : ''}`}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this verse'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this verse'}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 24 24" 
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>

      <style jsx>{`
        .bookmark-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: ${padding};
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: #94a3b8;
          transition: all 0.2s;
        }

        .bookmark-btn:hover {
          background: rgba(139, 92, 246, 0.1);
          color: #8B5CF6;
        }

        .bookmark-btn.bookmarked {
          color: #8B5CF6;
        }

        .bookmark-btn.animating {
          transform: scale(1.2);
        }

        .bookmark-btn.animating.bookmarked svg {
          animation: bookmark-pop 0.3s ease;
        }

        @keyframes bookmark-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
}
