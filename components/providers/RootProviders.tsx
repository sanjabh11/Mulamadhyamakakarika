"use client";

import React, { useEffect, useState } from 'react';
import { UserProvider } from '../../contexts/UserContext';
import { MembershipProvider } from '../whop/MembershipTiers';
import { ThemeProvider } from '../../contexts/ThemeContext';
import ErrorBoundary from '../ErrorBoundary';
import OnboardingModal from '../OnboardingModal';
import { initAnalytics } from '../../lib/analytics';
import { updateStreak } from '../../lib/user-progress';

/**
 * RootProviders
 * 
 * Ports the logic from legacy pages/_app.js to App Router.
 * Handles:
 * 1. Global Context Providers (User, Membership)
 * 2. Error Boundary
 * 3. Analytics Initialization
 * 4. Streak Tracking
 * 5. Onboarding Modal
 */
export default function RootProviders({ children }: { children: React.ReactNode }) {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initialize analytics
        initAnalytics();
        // Update streak for guest users
        updateStreak();

        // Show onboarding only if not completed previously
        const hasOnboarded = localStorage.getItem('mmk_onboarded');
        if (!hasOnboarded) {
            const timer = setTimeout(() => {
                setShowOnboarding(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Prevent hydration mismatch for features that depend on window/localstorage
    if (!mounted) {
        return (
            <ErrorBoundary>
                <ThemeProvider>
                    <MembershipProvider>
                        <UserProvider>
                            {children}
                        </UserProvider>
                    </MembershipProvider>
                </ThemeProvider>
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <MembershipProvider>
                    <UserProvider>
                        {children}
                        {showOnboarding && (
                            <OnboardingModal
                                onComplete={(data: any) => {
                                    console.log('Onboarding completed:', data);
                                    localStorage.setItem('mmk_onboarded', 'true');
                                    setShowOnboarding(false);
                                }}
                            />
                        )}
                    </UserProvider>
                </MembershipProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
