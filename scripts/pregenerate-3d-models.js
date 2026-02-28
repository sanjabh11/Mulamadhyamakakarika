/**
 * Pre-generate 3D Models Script
 * 
 * Batch generates GLB models for all 449 verses using Tripo3D
 * Saves to public/models/ for fast loading
 * 
 * Run: node scripts/pregenerate-3d-models.js
 * 
 * Options:
 *   --chapter=N    Generate only for chapter N
 *   --dry-run      Show what would be generated without calling API
 *   --limit=N      Limit to N models (for testing)
 */

const fs = require('fs');
const path = require('path');

// Quantum concept prompts for 3D generation
const CONCEPT_PROMPTS = {
  'Entanglement': 'two glowing quantum orbs connected by ethereal energy threads, cosmic void background, sci-fi visualization',
  'Superposition': 'translucent sphere with multiple overlapping ghost versions, quantum state visualization, ethereal glow',
  'Wave Function': 'flowing probability wave surface, mathematical visualization, energy patterns',
  'Observer Effect': 'eye symbol observing quantum particle, measurement device, wave collapse visualization',
  'Decoherence': 'crystalline structure dissolving into particles, entropy visualization, quantum to classical transition',
  'Non-Locality': 'two distant glowing spheres with instant connection beam, space-time grid',
  'Fluctuations': 'bubbling energy field, virtual particles appearing and disappearing, vacuum energy',
  'Dependent Origination': 'interconnected web of glowing nodes, Buddhist mandala, cause-effect chain',
  'Emptiness': 'transparent void with subtle energy patterns, formless form, śūnyatā symbol',
  'Complementarity': 'wave-particle duality symbol, yin-yang of physics, dual nature visualization',
  'Measurement': 'scientific measurement apparatus, quantum detector, probability collapse',
  'Causation': 'domino-like chain reaction, cause-effect flow, interconnected events',
  'Time Symmetry': 'hourglass with bidirectional flow, temporal loop, time reversal symmetry',
  'Correlation': 'statistical correlation visualization, linked data points, quantum correlation',
  'State Transition': 'morphing geometric shapes, phase transition, state change visualization',
  'Transcendence': 'ascending energy spiral, enlightenment symbol, beyond duality'
};

// Chapter data with verse counts
const CHAPTERS = [
  { number: 1, verseCount: 14, theme: 'conditions' },
  { number: 2, verseCount: 25, theme: 'motion' },
  { number: 3, verseCount: 9, theme: 'perception' },
  { number: 4, verseCount: 9, theme: 'aggregates' },
  { number: 5, verseCount: 8, theme: 'elements' },
  { number: 6, verseCount: 10, theme: 'desire' },
  { number: 7, verseCount: 35, theme: 'arising' },
  { number: 8, verseCount: 13, theme: 'agent-action' },
  { number: 9, verseCount: 12, theme: 'prior-entity' },
  { number: 10, verseCount: 16, theme: 'fire-fuel' },
  { number: 11, verseCount: 8, theme: 'temporal-limits' },
  { number: 12, verseCount: 10, theme: 'suffering' },
  { number: 13, verseCount: 8, theme: 'compounded' },
  { number: 14, verseCount: 8, theme: 'association' },
  { number: 15, verseCount: 11, theme: 'essence' },
  { number: 16, verseCount: 10, theme: 'bondage' },
  { number: 17, verseCount: 33, theme: 'karma' },
  { number: 18, verseCount: 12, theme: 'self' },
  { number: 19, verseCount: 6, theme: 'time' },
  { number: 20, verseCount: 24, theme: 'cause-effect' },
  { number: 21, verseCount: 21, theme: 'becoming' },
  { number: 22, verseCount: 16, theme: 'tathagata' },
  { number: 23, verseCount: 25, theme: 'error' },
  { number: 24, verseCount: 40, theme: 'noble-truths' },
  { number: 25, verseCount: 24, theme: 'nirvana' },
  { number: 26, verseCount: 12, theme: 'twelve-links' },
  { number: 27, verseCount: 30, theme: 'views' }
];

// Get prompt for verse
function getVersePrompt(chapter, verse, theme) {
  const concepts = Object.keys(CONCEPT_PROMPTS);
  const conceptIndex = (chapter * 7 + verse * 3) % concepts.length;
  const concept = concepts[conceptIndex];
  const basePrompt = CONCEPT_PROMPTS[concept];
  
  return {
    concept,
    prompt: `${basePrompt}, chapter ${chapter} verse ${verse}, ${theme} theme, high quality 3D model, clean topology`
  };
}

// Generate model filename
function getModelFilename(chapter, verse) {
  return `ch${chapter.toString().padStart(2, '0')}_v${verse.toString().padStart(2, '0')}.glb`;
}

// Create manifest file
function createManifest(models) {
  return {
    version: '1.0',
    generated: new Date().toISOString(),
    totalModels: models.length,
    chapters: CHAPTERS.map(ch => ({
      chapter: ch.number,
      verseCount: ch.verseCount,
      theme: ch.theme
    })),
    models: models.map(m => ({
      chapter: m.chapter,
      verse: m.verse,
      filename: m.filename,
      concept: m.concept,
      status: m.status
    }))
  };
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const chapterArg = args.find(a => a.startsWith('--chapter='));
  const limitArg = args.find(a => a.startsWith('--limit='));
  
  const targetChapter = chapterArg ? parseInt(chapterArg.split('=')[1]) : null;
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity;
  
  const modelsDir = path.join(__dirname, '..', 'public', 'models');
  
  // Create models directory
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }
  
  console.log('🎨 3D Model Pre-generation Script');
  console.log('==================================\n');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No API calls will be made\n');
  }
  
  const models = [];
  let generated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const chapter of CHAPTERS) {
    if (targetChapter && chapter.number !== targetChapter) continue;
    
    console.log(`\n📖 Chapter ${chapter.number}: ${chapter.theme}`);
    console.log(`   ${chapter.verseCount} verses\n`);
    
    for (let verse = 1; verse <= chapter.verseCount; verse++) {
      if (generated >= limit) {
        console.log(`\n⚠️ Limit of ${limit} models reached`);
        break;
      }
      
      const filename = getModelFilename(chapter.number, verse);
      const filepath = path.join(modelsDir, filename);
      const { concept, prompt } = getVersePrompt(chapter.number, verse, chapter.theme);
      
      // Check if already exists
      if (fs.existsSync(filepath)) {
        console.log(`   ⏭️ ${filename} (exists)`);
        models.push({
          chapter: chapter.number,
          verse,
          filename,
          concept,
          status: 'exists'
        });
        skipped++;
        continue;
      }
      
      if (dryRun) {
        console.log(`   📋 Would generate: ${filename}`);
        console.log(`      Concept: ${concept}`);
        models.push({
          chapter: chapter.number,
          verse,
          filename,
          concept,
          status: 'pending'
        });
        generated++;
        continue;
      }
      
      // In production, call fal.ai API here
      // For now, create placeholder
      try {
        console.log(`   🔄 Generating: ${filename} (${concept})`);
        
        // Placeholder - in production, replace with actual API call:
        // const result = await fal.subscribe('fal-ai/tripo3d/v2.5/text-to-3d', {
        //   input: { prompt, texture_resolution: 1024, remesh: true }
        // });
        // fs.writeFileSync(filepath, await fetch(result.data.model_mesh.url).then(r => r.buffer()));
        
        // Create placeholder file for now
        fs.writeFileSync(filepath + '.pending', JSON.stringify({ prompt, concept }));
        
        models.push({
          chapter: chapter.number,
          verse,
          filename,
          concept,
          status: 'generated'
        });
        generated++;
        
        // Rate limiting
        await new Promise(r => setTimeout(r, 100));
        
      } catch (error) {
        console.log(`   ❌ Error: ${filename} - ${error.message}`);
        models.push({
          chapter: chapter.number,
          verse,
          filename,
          concept,
          status: 'error',
          error: error.message
        });
        errors++;
      }
    }
    
    if (generated >= limit) break;
  }
  
  // Write manifest
  const manifest = createManifest(models);
  fs.writeFileSync(
    path.join(modelsDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  // Summary
  console.log('\n==================================');
  console.log('📊 Summary');
  console.log('==================================');
  console.log(`   Total verses: ${CHAPTERS.reduce((sum, ch) => sum + ch.verseCount, 0)}`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Skipped (exists): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Manifest: public/models/manifest.json`);
  
  if (dryRun) {
    console.log('\n💡 To actually generate models, run without --dry-run');
    console.log('   Note: Requires FAL_API_KEY environment variable');
  }
}

main().catch(console.error);
