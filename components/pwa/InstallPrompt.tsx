'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useHaptic } from '../../hooks/useHaptic';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const haptic = useHaptic();

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        haptic.tap();
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            haptic.success();
            console.log('User accepted install');
        } else {
            haptic.tap();
        }
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-quantum-deep/95 backdrop-blur-xl border border-quantum-neon/30 p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom flex justify-between items-center max-w-sm mx-auto">
            <div>
                <h3 className="font-bold text-white text-sm">Install App</h3>
                <p className="text-xs text-slate-300">Add to home screen for offline access</p>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => { setIsVisible(false); haptic.tap(); }}
                    className="p-2 text-slate-400 hover:text-white micro-tap"
                    aria-label="Close install prompt"
                >
                    <X size={18} />
                </button>
                <button
                    onClick={handleInstall}
                    className="bg-quantum-neon text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-quantum-neon/90 transition-colors micro-tap shadow-lg shadow-quantum-neon/20"
                >
                    <Download size={14} /> Install
                </button>
            </div>
        </div>
    );
}
