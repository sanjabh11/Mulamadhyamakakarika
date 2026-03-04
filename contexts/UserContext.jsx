"use client";

/**
 * User Context Provider
 * @fix H2 - No user auth system
 * 
 * Provides user authentication state and tier access throughout the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TIERS, hasChapterAccess, canUseAiAnimation, hasFeature, formatTierName } from '../lib/whop-auth';
import { identify } from '../lib/analytics';

// Create context
const UserContext = createContext(null);

// Default user state
const DEFAULT_USER = {
  id: null,
  email: null,
  tier: TIERS.FREE,
  isAuthenticated: false,
  isLoading: true,
  animationsUsedToday: 0
};

/**
 * User Provider Component
 * Wrap your app with this to provide user context
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check current authentication status
   * In production, this would call your Whop auth endpoint
   */
  const checkAuthStatus = async () => {
    try {
      setUser(prev => ({ ...prev, isLoading: true }));

      // Check for existing session token
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('whop_session_token')
        : null;

      if (!token) {
        setUser({ ...DEFAULT_USER, isLoading: false });
        return;
      }

      // Validate token with backend
      // Replace with actual Whop API call
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Token invalid, clear and reset
        localStorage.removeItem('whop_session_token');
        setUser({ ...DEFAULT_USER, isLoading: false });
        return;
      }

      const userData = await response.json();

      // Identify user in analytics
      identify(userData.id, {
        email: userData.email,
        tier: userData.tier,
        createdAt: userData.createdAt
      });

      setUser({
        id: userData.id,
        email: userData.email,
        tier: userData.tier || TIERS.FREE,
        isAuthenticated: true,
        isLoading: false,
        animationsUsedToday: userData.animationsUsedToday || 0
      });

    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err.message);
      setUser({ ...DEFAULT_USER, isLoading: false });
    }
  };

  /**
   * Login with Whop OAuth
   * Redirects to Whop login page
   */
  const login = useCallback(() => {
    const whopClientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID;
    const redirectUri = typeof window !== 'undefined'
      ? `${window.location.origin}/api/auth/callback`
      : '';

    // Construct Whop OAuth URL
    const authUrl = new URL('https://whop.com/oauth');
    authUrl.searchParams.set('client_id', whopClientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile email');

    window.location.href = authUrl.toString();
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local state regardless
      localStorage.removeItem('whop_session_token');
      setUser({ ...DEFAULT_USER, isLoading: false });
    }
  }, []);

  /**
   * Check if user can access a chapter
   */
  const checkChapterAccess = useCallback((chapterNumber) => {
    return hasChapterAccess(user.tier, chapterNumber);
  }, [user.tier]);

  /**
   * Check if user can use AI animations
   */
  const checkAnimationAccess = useCallback(() => {
    return canUseAiAnimation(user.tier, user.animationsUsedToday);
  }, [user.tier, user.animationsUsedToday]);

  /**
   * Check if user has a feature
   */
  const checkFeature = useCallback((feature) => {
    return hasFeature(user.tier, feature);
  }, [user.tier]);

  /**
   * Increment animation usage count
   */
  const incrementAnimationUsage = useCallback(() => {
    setUser(prev => ({
      ...prev,
      animationsUsedToday: prev.animationsUsedToday + 1
    }));
  }, []);

  // Context value
  const value = {
    user,
    error,
    login,
    logout,
    checkChapterAccess,
    checkAnimationAccess,
    checkFeature,
    incrementAnimationUsage,
    tierName: formatTierName(user.tier),
    isLoading: user.isLoading,
    isAuthenticated: user.isAuthenticated,
    isPaid: user.tier !== TIERS.FREE
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to access user context
 * @returns {object} User context value
 */
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}

/**
 * HOC to require authentication
 * @param {Component} Component - Component to wrap
 * @param {object} options - Options
 * @returns {Component} Wrapped component
 */
export function withAuth(Component, options = {}) {
  const { requiredTier = null, redirectTo = '/login' } = options;

  return function AuthenticatedComponent(props) {
    const { user, isLoading, isAuthenticated } = useUser();

    // Show loading state
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <div className="loading-spinner" />
        </div>
      );
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
      return null;
    }

    // Check tier requirement
    if (requiredTier) {
      const tierOrder = [TIERS.FREE, TIERS.SEEKER, TIERS.PRACTITIONER, TIERS.TEACHER];
      const userTierIndex = tierOrder.indexOf(user.tier);
      const requiredTierIndex = tierOrder.indexOf(requiredTier);

      if (userTierIndex < requiredTierIndex) {
        // Show upgrade prompt instead of redirecting
        return (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Upgrade Required</h2>
            <p>This content requires a {formatTierName(requiredTier)} subscription.</p>
            <a href="/pricing" style={{ color: '#8B5CF6' }}>View Plans</a>
          </div>
        );
      }
    }

    return <Component {...props} />;
  };
}

export default UserContext;
