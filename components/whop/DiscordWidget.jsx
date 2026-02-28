/**
 * DiscordWidget - Discord Community Integration for Whop
 * 
 * Provides Discord server embed, invite links, and activity feed
 */

import React, { useState, useEffect } from 'react';
import { useMembership } from './MembershipTiers';

// Discord configuration
const DISCORD_CONFIG = {
  serverId: process.env.NEXT_PUBLIC_DISCORD_SERVER_ID || 'YOUR_SERVER_ID',
  inviteLink: process.env.NEXT_PUBLIC_DISCORD_INVITE || 'https://discord.gg/quantum-sangha',
  widgetUrl: 'https://discord.com/widget',
  channels: {
    general: 'General Discussion',
    chapter_discussion: 'Chapter Discussions',
    meditation: 'Meditation Circle',
    quantum_physics: 'Quantum Physics',
    announcements: 'Announcements'
  }
};

/**
 * Discord Server Widget Component
 */
export default function DiscordWidget({ 
  showWidget = true,
  showInvite = true,
  showActivity = true,
  compact = false 
}) {
  const { tier, tierConfig } = useMembership();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user has community access
  const hasAccess = tierConfig?.limits?.community !== undefined;
  const isPremium = tier === 'seeker' || tier === 'enlightened';
  const isVIP = tier === 'enlightened';

  useEffect(() => {
    // Simulate loading Discord widget
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (compact) {
    return (
      <div className="discord-compact">
        <a 
          href={DISCORD_CONFIG.inviteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="discord-link"
        >
          <DiscordIcon />
          <span>Join our Discord</span>
        </a>
        
        <style jsx>{`
          .discord-compact {
            display: inline-block;
          }
          
          .discord-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #5865F2;
            border-radius: 8px;
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
          }
          
          .discord-link:hover {
            background: #4752c4;
            transform: translateY(-1px);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="discord-widget">
      {/* Header */}
      <div className="widget-header">
        <DiscordIcon size={28} />
        <div>
          <h3>Quantum Sangha Community</h3>
          <p>Connect with fellow seekers</p>
        </div>
      </div>

      {/* Channel List */}
      <div className="channels-section">
        <h4>Community Channels</h4>
        <ul className="channel-list">
          {Object.entries(DISCORD_CONFIG.channels).map(([key, name]) => {
            const isLocked = key === 'meditation' && !isPremium;
            const isVIPOnly = key === 'announcements' && !isVIP;
            
            return (
              <li key={key} className={`channel ${isLocked || isVIPOnly ? 'locked' : ''}`}>
                <span className="channel-icon">#</span>
                <span className="channel-name">{name}</span>
                {isLocked && <span className="lock">🔒 Seeker+</span>}
                {isVIPOnly && <span className="lock">🔒 Enlightened</span>}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Activity Feed */}
      {showActivity && (
        <div className="activity-section">
          <h4>Recent Activity</h4>
          <div className="activity-feed">
            <ActivityItem 
              user="Dharma_Explorer"
              action="completed Chapter 15 quiz"
              time="2 hours ago"
            />
            <ActivityItem 
              user="QuantumSeeker42"
              action="started the 27-Day Journey"
              time="5 hours ago"
            />
            <ActivityItem 
              user="Bodhi_Mind"
              action="earned the Scholar achievement"
              time="1 day ago"
            />
          </div>
        </div>
      )}

      {/* Daily Verse */}
      <div className="daily-verse">
        <h4>📿 Daily Verse</h4>
        <blockquote>
          "Whatever is dependently co-arisen, that is explained to be emptiness."
          <cite>— Nāgārjuna, MMK 24.18</cite>
        </blockquote>
      </div>

      {/* Join Button */}
      {showInvite && (
        <div className="join-section">
          <a 
            href={DISCORD_CONFIG.inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="join-btn"
          >
            <DiscordIcon size={20} />
            Join the Community
          </a>
          <p className="member-count">500+ members online</p>
        </div>
      )}

      {/* Embedded Widget */}
      {showWidget && (
        <div className="embed-section">
          <iframe
            src={`${DISCORD_CONFIG.widgetUrl}?id=${DISCORD_CONFIG.serverId}&theme=dark`}
            width="100%"
            height="300"
            frameBorder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        </div>
      )}

      <style jsx>{`
        .discord-widget {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(88, 101, 242, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
        }
        
        .widget-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .widget-header h3 {
          color: #e2e8f0;
          font-size: 1.25rem;
          margin: 0;
        }
        
        .widget-header p {
          color: #94a3b8;
          font-size: 0.875rem;
          margin: 0;
        }
        
        .channels-section, .activity-section {
          margin-bottom: 1.5rem;
        }
        
        h4 {
          color: #94a3b8;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 0.75rem;
        }
        
        .channel-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .channel {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 6px;
          color: #94a3b8;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .channel:hover:not(.locked) {
          background: rgba(88, 101, 242, 0.1);
          color: #e2e8f0;
        }
        
        .channel.locked {
          opacity: 0.5;
        }
        
        .channel-icon {
          color: #5865F2;
          font-weight: bold;
        }
        
        .channel-name {
          flex: 1;
        }
        
        .lock {
          font-size: 0.7rem;
          color: #8B5CF6;
        }
        
        .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .daily-verse {
          background: rgba(88, 101, 242, 0.1);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .daily-verse blockquote {
          margin: 0;
          color: #e2e8f0;
          font-style: italic;
          line-height: 1.6;
        }
        
        .daily-verse cite {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #8B5CF6;
          font-style: normal;
        }
        
        .join-section {
          text-align: center;
        }
        
        .join-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          background: #5865F2;
          border-radius: 8px;
          color: white;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .join-btn:hover {
          background: #4752c4;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(88, 101, 242, 0.4);
        }
        
        .member-count {
          color: #64748b;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        
        .embed-section {
          margin-top: 1.5rem;
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

/**
 * Activity Item Component
 */
function ActivityItem({ user, action, time }) {
  return (
    <div className="activity-item">
      <div className="avatar">{user[0].toUpperCase()}</div>
      <div className="activity-content">
        <p><strong>{user}</strong> {action}</p>
        <span className="time">{time}</span>
      </div>
      
      <style jsx>{`
        .activity-item {
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
        
        .activity-content {
          flex: 1;
        }
        
        .activity-content p {
          color: #e2e8f0;
          font-size: 0.875rem;
          margin: 0;
        }
        
        .activity-content strong {
          color: #8B5CF6;
        }
        
        .time {
          color: #64748b;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}

/**
 * Discord Icon Component
 */
function DiscordIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

/**
 * Discord Bot Daily Verse Sender (Server-side)
 */
export const discordBotConfig = {
  dailyVerseChannel: 'daily-verse',
  announcementsChannel: 'announcements',
  verseSchedule: '0 8 * * *', // 8 AM daily
  
  async sendDailyVerse(verse) {
    // This would be called from a server-side cron job
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const message = {
      embeds: [{
        title: `📿 Daily Verse: Chapter ${verse.chapter}, Verse ${verse.number}`,
        description: verse.text,
        fields: [
          { name: 'Madhyamaka Insight', value: verse.madhyamaka, inline: false },
          { name: 'Quantum Parallel', value: verse.quantum, inline: false }
        ],
        color: 0x8B5CF6,
        footer: { text: 'Nāgārjuna\'s Quantum Reflections' }
      }]
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }
};
