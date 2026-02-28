/**
 * DiscussionSection - Chapter Discussion Forums
 * 
 * Provides comment/discussion functionality for each chapter
 * Stores in localStorage for demo, would use backend in production
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useMembership } from './MembershipTiers';

// Storage key
const DISCUSSIONS_KEY = 'mmk_discussions';

function getStoredDiscussions() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(DISCUSSIONS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveDiscussions(discussions) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DISCUSSIONS_KEY, JSON.stringify(discussions));
}

/**
 * Main Discussion Section Component
 */
export default function DiscussionSection({ chapter, verse = null }) {
  const { tier } = useMembership();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const discussionId = verse ? `${chapter}-${verse}` : `chapter-${chapter}`;

  // Load comments on mount
  useEffect(() => {
    const stored = getStoredDiscussions();
    setComments(stored[discussionId] || []);
    
    // Get stored username
    const storedName = localStorage.getItem('mmk_username');
    if (storedName) setUserName(storedName);
  }, [discussionId]);

  // Submit new comment
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    setIsSubmitting(true);

    const comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: userName.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      tier: tier
    };

    const stored = getStoredDiscussions();
    const updatedComments = [...(stored[discussionId] || []), comment];
    stored[discussionId] = updatedComments;
    saveDiscussions(stored);

    setComments(updatedComments);
    setNewComment('');
    localStorage.setItem('mmk_username', userName.trim());
    
    setIsSubmitting(false);
  }, [newComment, userName, discussionId, tier]);

  // Like a comment
  const handleLike = useCallback((commentId) => {
    const stored = getStoredDiscussions();
    const updatedComments = (stored[discussionId] || []).map(c => 
      c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
    );
    stored[discussionId] = updatedComments;
    saveDiscussions(stored);
    setComments(updatedComments);
  }, [discussionId]);

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return (b.likes || 0) - (a.likes || 0);
  });

  return (
    <div className="discussion-section">
      {/* Header */}
      <div className="discussion-header">
        <h3>💬 Discussion</h3>
        <span className="comment-count">{comments.length} comments</span>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="name-input"
            maxLength={30}
          />
          <div className="tier-badge">{tier}</div>
        </div>
        <textarea
          placeholder="Share your insights on this chapter..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
          rows={3}
          maxLength={500}
        />
        <div className="form-footer">
          <span className="char-count">{newComment.length}/500</span>
          <button 
            type="submit" 
            disabled={!newComment.trim() || !userName.trim() || isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Sort Options */}
      {comments.length > 0 && (
        <div className="sort-options">
          <button 
            className={sortBy === 'newest' ? 'active' : ''}
            onClick={() => setSortBy('newest')}
          >
            Newest
          </button>
          <button 
            className={sortBy === 'popular' ? 'active' : ''}
            onClick={() => setSortBy('popular')}
          >
            Most Liked
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {sortedComments.length === 0 ? (
          <div className="no-comments">
            <p>Be the first to share your insights!</p>
          </div>
        ) : (
          sortedComments.map(comment => (
            <CommentCard 
              key={comment.id}
              comment={comment}
              onLike={() => handleLike(comment.id)}
            />
          ))
        )}
      </div>

      {/* Discussion Guidelines */}
      <div className="guidelines">
        <h4>Community Guidelines</h4>
        <ul>
          <li>Share insights with respect and openness</li>
          <li>Connect Madhyamaka concepts to your understanding</li>
          <li>Explore quantum parallels thoughtfully</li>
        </ul>
      </div>

      <style jsx>{`
        .discussion-section {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        
        .discussion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .discussion-header h3 {
          color: #e2e8f0;
          font-size: 1.25rem;
          margin: 0;
        }
        
        .comment-count {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .comment-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .form-row {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        
        .name-input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #e2e8f0;
          font-size: 0.9rem;
        }
        
        .name-input:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.5);
        }
        
        .tier-badge {
          padding: 0.5rem 0.75rem;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 6px;
          color: #8B5CF6;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .comment-input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #e2e8f0;
          font-size: 0.9rem;
          resize: vertical;
          min-height: 80px;
        }
        
        .comment-input:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.5);
        }
        
        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
        }
        
        .char-count {
          color: #64748b;
          font-size: 0.75rem;
        }
        
        .submit-btn {
          padding: 0.5rem 1.25rem;
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .sort-options {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .sort-options button {
          padding: 0.375rem 0.75rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #94a3b8;
          font-size: 0.8rem;
          cursor: pointer;
        }
        
        .sort-options button.active {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
          color: #8B5CF6;
        }
        
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .no-comments {
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }
        
        .guidelines {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 8px;
        }
        
        .guidelines h4 {
          color: #94a3b8;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 0.5rem;
        }
        
        .guidelines ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .guidelines li {
          color: #64748b;
          font-size: 0.8rem;
          padding: 0.25rem 0;
        }
        
        .guidelines li::before {
          content: "• ";
          color: #8B5CF6;
        }
      `}</style>
    </div>
  );
}

/**
 * Individual Comment Card
 */
function CommentCard({ comment, onLike }) {
  const timeAgo = getTimeAgo(comment.createdAt);
  
  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="author-info">
          <div className="avatar">{comment.author[0].toUpperCase()}</div>
          <div>
            <span className="author-name">{comment.author}</span>
            {comment.tier !== 'free' && (
              <span className={`tier-tag ${comment.tier}`}>{comment.tier}</span>
            )}
          </div>
        </div>
        <span className="timestamp">{timeAgo}</span>
      </div>
      
      <p className="comment-text">{comment.text}</p>
      
      <div className="comment-actions">
        <button onClick={onLike} className="like-btn">
          ❤️ {comment.likes || 0}
        </button>
        <button className="reply-btn">Reply</button>
      </div>

      <style jsx>{`
        .comment-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1rem;
        }
        
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .author-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #EC4899);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .author-name {
          color: #e2e8f0;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .tier-tag {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .tier-tag.seeker {
          background: rgba(139, 92, 246, 0.2);
          color: #8B5CF6;
        }
        
        .tier-tag.enlightened {
          background: rgba(245, 158, 11, 0.2);
          color: #F59E0B;
        }
        
        .timestamp {
          color: #64748b;
          font-size: 0.75rem;
        }
        
        .comment-text {
          color: #e2e8f0;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0 0 0.75rem;
        }
        
        .comment-actions {
          display: flex;
          gap: 1rem;
        }
        
        .like-btn, .reply-btn {
          background: none;
          border: none;
          color: #64748b;
          font-size: 0.8rem;
          cursor: pointer;
          padding: 0;
        }
        
        .like-btn:hover, .reply-btn:hover {
          color: #8B5CF6;
        }
      `}</style>
    </div>
  );
}

/**
 * Helper: Get time ago string
 */
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
