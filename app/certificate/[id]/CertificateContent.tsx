'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, Share2, Download } from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import { useMembership } from '../../../components/whop/MembershipTiers';

interface CertificateContentProps {
  id: string;
}

export default function CertificateContent({ id }: CertificateContentProps) {
    const { user } = useUser();
    const { tier } = useMembership();

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
            <header className="p-6 border-b border-white/5 flex items-center justify-between no-print">
                <Link href="/progress" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} /> Back to Progress
                </Link>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 text-sm px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                        <Share2 size={16} /> Share
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-2 text-sm px-4 py-2 bg-quantum-neon text-black font-semibold rounded-full hover:bg-quantum-neon/90 transition-colors">
                        <Download size={16} /> Save PDF
                    </button>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 bg-[url('/assets/bg-stars.png')]">
                <div
                    className="relative bg-white text-slate-900 mx-auto w-full max-w-4xl p-12 md:p-20 shadow-2xl border-[16px] border-slate-900 print:border-none print:shadow-none"
                    style={{ aspectRatio: '1.414/1' }}
                >
                    <div className="absolute inset-4 border-2 border-quantum-gold/50 rounded-sm"></div>
                    <div className="absolute inset-6 border border-quantum-gold/30 rounded-sm"></div>

                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Award className="text-quantum-gold mb-6" size={64} />

                        <div className="text-sm font-mono tracking-[0.3em] text-slate-500 uppercase mb-4">
                            Nāgārjuna&apos;s Quantum Reflections
                        </div>

                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 mb-8 italic">
                            Certificate of Mastery
                        </h1>

                        <p className="text-lg text-slate-600 mb-4">This acknowledges that</p>

                        <div className="text-3xl md:text-5xl font-bold font-serif text-slate-900 border-b-2 border-slate-200 px-12 pb-2 mb-8 inline-block min-w-[300px]">
                            {user?.email || 'Dedicated Seeker'}
                        </div>

                        <p className="text-lg text-slate-600 max-w-lg mx-auto mb-12">
                            has successfully completed all contemplations and passed the rigorous assessment for <br />
                            <strong className="text-slate-900 mt-2 block text-xl">Chapter {id}</strong>
                        </p>

                        <div className="flex w-full justify-between items-end mt-auto px-12">
                            <div className="text-left">
                                <div className="w-40 border-b border-slate-400 mb-2"></div>
                                <div className="text-sm text-slate-500 font-serif">Date of Achievement</div>
                                <div className="text-base font-semibold">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-serif text-quantum-gold mb-2" style={{ fontFamily: 'cursive' }}>M.M.K.</div>
                                <div className="w-40 border-b border-slate-400 mb-2 inline-block"></div>
                                <div className="text-sm text-slate-500 font-serif">The Middle Way Verification</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          main, main * { visibility: visible; }
          main { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: none; }
          @page { size: landscape; margin: 0; }
        }
      `}} />
        </div>
    );
}
