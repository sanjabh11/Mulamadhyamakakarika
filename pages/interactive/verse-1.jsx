import React from 'react';
import Verse1Animation from '../../components/animations/Verse1Animation';
import Head from 'next/head';

// This page will render the full-screen interactive animation for Verse 1
export default function InteractiveVerse1() {
  return (
    <>
      <Head>
        <title>Verse 1: Interactive Double Slit</title>
        <meta name="description" content="Interactive 3D visualization of the double-slit experiment related to Mulamadhyamakakarika Verse 1." />
        {/* Add other relevant meta tags if needed */}
      </Head>
      {/* Render the animation component */}
      <Verse1Animation />
    </>
  );
}

// Optional: If you need specific layout adjustments that can't be handled
// solely within the component's CSS module, you might add global styles
// or adjust the _app.js layout, but often it's best to keep styling
// encapsulated within the component and its module.
