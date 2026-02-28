/**
 * Context Manager for MMK Generation
 * 
 * This script manages the context-mmk.json file for cross-chapter
 * memory persistence during AI content generation.
 * 
 * Usage:
 *   node scripts/context-manager.js inject <chapter>   - Get context for generation
 *   node scripts/context-manager.js update <chapter>   - Update after generation
 *   node scripts/context-manager.js report             - Generate usage report
 *   node scripts/context-manager.js validate           - Validate context integrity
 */

const fs = require('fs');
const path = require('path');

const CONTEXT_PATH = path.join(__dirname, '../data/context-mmk.json');

// Load context
function loadContext() {
  try {
    const data = fs.readFileSync(CONTEXT_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading context:', error.message);
    process.exit(1);
  }
}

// Save context
function saveContext(context) {
  context.meta.last_updated = new Date().toISOString();
  fs.writeFileSync(CONTEXT_PATH, JSON.stringify(context, null, 2));
  console.log('✅ Context saved successfully');
}

// Generate injection prompt for Gemini
function generateInjectionPrompt(chapter) {
  const context = loadContext();
  
  const prompt = `
# CONTEXT INJECTION FOR CHAPTER ${chapter}

## Previously Established Knowledge
Load the following context before generating Chapter ${chapter}:

### Chapters Completed: ${context.meta.chapters_completed}
### Total Verses Generated: ${context.meta.total_verses_generated}

---

## QUANTUM CONCEPTS - USAGE STATUS

### Already Used as Primary (DO NOT use as primary again):
${Object.entries(context.quantum_usage_tracker.concepts_used)
  .filter(([_, data]) => data.primary_in?.length >= 3)
  .map(([concept, data]) => `- ${concept}: used in ${data.primary_in.join(', ')}`)
  .join('\n') || '(None exhausted yet)'}

### Partially Used (Use sparingly):
${Object.entries(context.quantum_usage_tracker.concepts_used)
  .filter(([_, data]) => data.primary_in?.length > 0 && data.primary_in?.length < 3)
  .map(([concept, data]) => `- ${concept}: primary in ${data.primary_in.join(', ')}`)
  .join('\n') || '(None yet)'}

### Available Fresh Concepts (PREFER these):
${context.quantum_usage_tracker.available_concepts
  .filter(c => !context.quantum_usage_tracker.concepts_used[c]?.primary_in?.length)
  .slice(0, 10)
  .map(c => `- ${c}`)
  .join('\n')}

### Reserved Concepts:
${Object.entries(context.quantum_usage_tracker.concepts_reserved_for)
  .map(([concept, chapter]) => `- ${concept}: reserved for ${chapter}`)
  .join('\n')}

---

## ANIMATION TYPES - USAGE STATUS

### Animation Types Used This Session:
${Object.entries(context.animation_registry.global_animation_count)
  .filter(([_, count]) => count > 0)
  .sort((a, b) => b[1] - a[1])
  .map(([type, count]) => `- ${type}: ${count} times`)
  .join('\n') || '(None yet)'}

### Underused Animation Types (PREFER these):
${Object.entries(context.animation_registry.global_animation_count)
  .filter(([_, count]) => count < 3)
  .map(([type]) => `- ${type}`)
  .join('\n')}

### Previous Chapter's Last Animation Type:
${context.animation_registry[`chapter_${chapter - 1}`]?.types_used?.slice(-1)[0] || '(N/A - first chapter)'}
(DO NOT start this chapter with the same type)

---

## PHILOSOPHICAL TERMS ALREADY INTRODUCED

${Object.entries(context.philosophical_foundation.core_terms_introduced)
  .map(([term, data]) => `- ${term}: first used in ${data.first_used}`)
  .join('\n') || '(None yet - introduce foundational terms)'}

---

## ARGUMENTS ESTABLISHED (Can reference as known)

${context.philosophical_foundation.arguments_established
  .map(arg => `- Ch${arg.chapter}: ${arg.argument}`)
  .join('\n') || '(None yet)'}

---

## LEARNING LEVEL FOR CHAPTER ${chapter}

Current Level: ${
  chapter <= 7 ? 'FOUNDATIONAL (introduce concepts carefully)' :
  chapter <= 14 ? 'INTERMEDIATE (can reference foundational concepts)' :
  chapter <= 21 ? 'ADVANCED (build on established arguments)' :
  'SYNTHESIS (connect all previous insights)'
}

---

## CROSS-REFERENCES TO INCLUDE

### Back-references (concepts established earlier):
${Object.entries(context.cross_references.back_references)
  .filter(([verse]) => verse.startsWith(`${chapter}.`))
  .map(([verse, refs]) => `- ${verse} should reference: ${refs.join(', ')}`)
  .join('\n') || '(None specified yet)'}

### Forward-references to plant:
${Object.entries(context.cross_references.forward_references)
  .filter(([_, refs]) => refs.some(r => r.startsWith(`${chapter}.`)))
  .map(([source, refs]) => `- ${source} will be referenced in: ${refs.join(', ')}`)
  .join('\n') || '(None specified yet)'}

---

## COLOR PALETTE FOR THIS CHAPTER

Recommended palette (rotate from previous):
${JSON.stringify(context.animation_registry.color_palettes.find(p => 
  !p.used_in_chapters.includes(chapter - 1)
)?.colors || context.animation_registry.color_palettes[0].colors)}

---

## GENERATION RULES REMINDER

1. ✅ Generate TOP 3 quantum parallels with full RESONANCE scoring
2. ✅ Include quiz questions at 3 tiers (beginner/intermediate/advanced)
3. ✅ Mark content with tier gating (free/seeker/practitioner/scholar)
4. ✅ Create discussion prompts for community
5. ✅ Include progress metadata (XP, prerequisites, unlocks)
6. ✅ At chapter end, generate certification summary
7. ❌ Do NOT repeat quantum concepts used as primary 3+ times
8. ❌ Do NOT use same animation type as previous verse
9. ❌ Do NOT use reserved quantum concepts for other chapters

NOW GENERATE CHAPTER ${chapter} WITH THIS CONTEXT LOADED.
`;

  console.log(prompt);
  
  // Also save to a file for easy copy-paste
  const outputPath = path.join(__dirname, `../data/injection-ch${chapter}.md`);
  fs.writeFileSync(outputPath, prompt);
  console.log(`\n📄 Injection prompt saved to: ${outputPath}`);
  
  return prompt;
}

// Update context after chapter generation
function updateContextFromGeneration(chapter, generatedDataPath) {
  const context = loadContext();
  
  let generatedData;
  try {
    generatedData = JSON.parse(fs.readFileSync(generatedDataPath, 'utf8'));
  } catch (error) {
    console.error('Error reading generated data:', error.message);
    console.log('\nUsage: node scripts/context-manager.js update <chapter> <path-to-generated-json>');
    process.exit(1);
  }
  
  const chapterKey = `chapter_${chapter}`;
  
  // Initialize chapter registry if not exists
  if (!context.animation_registry[chapterKey]) {
    context.animation_registry[chapterKey] = { 
      types_used: [], 
      color_palette: [],
      dominant_style: null
    };
  }
  
  // Process each verse
  generatedData.verses?.forEach(verse => {
    // Track animation types
    if (verse.animation?.type) {
      context.animation_registry[chapterKey].types_used.push(verse.animation.type);
      context.animation_registry.global_animation_count[verse.animation.type] = 
        (context.animation_registry.global_animation_count[verse.animation.type] || 0) + 1;
    }
    
    // Track quantum concepts
    verse.quantum_parallels?.forEach((parallel, idx) => {
      const concept = parallel.concept?.toLowerCase().replace(/ /g, '_');
      if (!concept) return;
      
      if (!context.quantum_usage_tracker.concepts_used[concept]) {
        context.quantum_usage_tracker.concepts_used[concept] = { 
          primary_in: [], 
          mentioned_in: [],
          exhausted: false
        };
      }
      
      const verseId = verse.verse_id || `${chapter}.${verse.verse}`;
      
      if (idx === 0) {
        context.quantum_usage_tracker.concepts_used[concept].primary_in.push(verseId);
        // Mark as exhausted if used 3+ times as primary
        if (context.quantum_usage_tracker.concepts_used[concept].primary_in.length >= 3) {
          context.quantum_usage_tracker.concepts_used[concept].exhausted = true;
        }
      } else {
        context.quantum_usage_tracker.concepts_used[concept].mentioned_in.push(verseId);
      }
      
      // Remove from available if used
      const availableIdx = context.quantum_usage_tracker.available_concepts.indexOf(concept);
      if (availableIdx > -1 && context.quantum_usage_tracker.concepts_used[concept].primary_in.length > 0) {
        // Keep in available but mark usage
      }
    });
    
    // Track philosophical terms
    verse.key_terms?.forEach(term => {
      const termKey = term.sanskrit || term.term;
      if (termKey && !context.philosophical_foundation.core_terms_introduced[termKey]) {
        context.philosophical_foundation.core_terms_introduced[termKey] = {
          first_used: verse.verse_id || `${chapter}.${verse.verse}`,
          depth_level: chapter <= 7 ? 'foundational' : chapter <= 14 ? 'intermediate' : 'advanced',
          definition: term.definition || term.meaning
        };
      }
    });
  });
  
  // Update chapter summary
  if (generatedData.chapter_summary) {
    context.chapter_summaries[chapter] = generatedData.chapter_summary;
  }
  
  // Update learning progression
  if (generatedData.arguments_established) {
    context.philosophical_foundation.arguments_established.push(...generatedData.arguments_established);
  }
  
  // Update meta
  context.meta.chapters_completed = Math.max(context.meta.chapters_completed, parseInt(chapter));
  context.meta.total_verses_generated += (generatedData.verses?.length || 0);
  
  // Update learning level
  if (chapter <= 7) {
    context.learning_progression.pedagogical_scaffolding.current_level = 'foundational';
  } else if (chapter <= 14) {
    context.learning_progression.pedagogical_scaffolding.current_level = 'intermediate';
  } else if (chapter <= 21) {
    context.learning_progression.pedagogical_scaffolding.current_level = 'advanced';
  } else {
    context.learning_progression.pedagogical_scaffolding.current_level = 'synthesis';
  }
  
  // Add generation log entry
  context.generation_log.sessions.push({
    date: new Date().toISOString().split('T')[0],
    chapters_generated: [parseInt(chapter)],
    verses_generated: generatedData.verses?.length || 0,
    quantum_concepts_added: [...new Set(
      generatedData.verses?.flatMap(v => 
        v.quantum_parallels?.map(p => p.concept) || []
      ) || []
    )],
    animation_types_used: [...new Set(
      generatedData.verses?.map(v => v.animation?.type).filter(Boolean) || []
    )],
    notes: generatedData.generation_notes || ''
  });
  
  saveContext(context);
  
  console.log(`\n📊 Context Updated for Chapter ${chapter}:`);
  console.log(`   Verses processed: ${generatedData.verses?.length || 0}`);
  console.log(`   Total verses now: ${context.meta.total_verses_generated}`);
  console.log(`   Chapters completed: ${context.meta.chapters_completed}`);
}

// Generate usage report
function generateReport() {
  const context = loadContext();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 MMK CONTEXT USAGE REPORT');
  console.log('='.repeat(60));
  
  console.log('\n## PROGRESS');
  console.log(`Chapters completed: ${context.meta.chapters_completed} / ${context.meta.total_chapters}`);
  console.log(`Verses generated: ${context.meta.total_verses_generated} / ${context.meta.total_verses_target}`);
  console.log(`Progress: ${Math.round((context.meta.total_verses_generated / context.meta.total_verses_target) * 100)}%`);
  
  console.log('\n## QUANTUM CONCEPT USAGE');
  const sortedConcepts = Object.entries(context.quantum_usage_tracker.concepts_used)
    .filter(([_, data]) => data.primary_in?.length > 0)
    .sort((a, b) => b[1].primary_in.length - a[1].primary_in.length);
  
  sortedConcepts.forEach(([concept, data]) => {
    const status = data.exhausted ? '❌ EXHAUSTED' : data.primary_in.length >= 2 ? '⚠️ NEARING LIMIT' : '✅';
    console.log(`${status} ${concept}: ${data.primary_in.length} primary, ${data.mentioned_in?.length || 0} mentions`);
  });
  
  console.log('\n## ANIMATION TYPE DISTRIBUTION');
  const sortedAnimations = Object.entries(context.animation_registry.global_animation_count)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);
  
  sortedAnimations.forEach(([type, count]) => {
    const bar = '█'.repeat(Math.min(count, 20));
    console.log(`${type.padEnd(25)} ${bar} ${count}`);
  });
  
  console.log('\n## PHILOSOPHICAL TERMS');
  console.log(`Total terms introduced: ${Object.keys(context.philosophical_foundation.core_terms_introduced).length}`);
  
  console.log('\n## GENERATION SESSIONS');
  context.generation_log.sessions.slice(-5).forEach(session => {
    console.log(`${session.date}: Ch${session.chapters_generated.join(',')} - ${session.verses_generated} verses`);
  });
  
  console.log('\n' + '='.repeat(60));
}

// Validate context integrity
function validateContext() {
  const context = loadContext();
  const issues = [];
  
  // Check for overused quantum concepts
  Object.entries(context.quantum_usage_tracker.concepts_used).forEach(([concept, data]) => {
    if (data.primary_in?.length > 5) {
      issues.push(`⚠️ Quantum concept "${concept}" used ${data.primary_in.length} times as primary (limit: 5)`);
    }
  });
  
  // Check for overused animation types
  Object.entries(context.animation_registry.global_animation_count).forEach(([type, count]) => {
    if (count > context.animation_registry.uniqueness_rules.max_global_per_type) {
      issues.push(`⚠️ Animation type "${type}" used ${count} times (limit: ${context.animation_registry.uniqueness_rules.max_global_per_type})`);
    }
  });
  
  // Check for consecutive same animation types within chapters
  Object.entries(context.animation_registry).forEach(([key, data]) => {
    if (key.startsWith('chapter_') && data.types_used) {
      for (let i = 1; i < data.types_used.length; i++) {
        if (data.types_used[i] === data.types_used[i-1]) {
          issues.push(`⚠️ ${key}: Consecutive same animation type "${data.types_used[i]}" at positions ${i-1} and ${i}`);
        }
      }
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ Context validation passed - no issues found');
  } else {
    console.log(`\n⚠️ Found ${issues.length} issues:\n`);
    issues.forEach(issue => console.log(issue));
  }
  
  return issues;
}

// CLI
const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

switch (command) {
  case 'inject':
    if (!arg1) {
      console.error('Usage: node scripts/context-manager.js inject <chapter>');
      process.exit(1);
    }
    generateInjectionPrompt(parseInt(arg1));
    break;
    
  case 'update':
    if (!arg1 || !arg2) {
      console.error('Usage: node scripts/context-manager.js update <chapter> <path-to-generated-json>');
      process.exit(1);
    }
    updateContextFromGeneration(arg1, arg2);
    break;
    
  case 'report':
    generateReport();
    break;
    
  case 'validate':
    validateContext();
    break;
    
  default:
    console.log(`
MMK Context Manager

Commands:
  inject <chapter>              Generate context injection prompt for Gemini
  update <chapter> <json-path>  Update context after generation
  report                        Generate usage report
  validate                      Validate context integrity

Examples:
  node scripts/context-manager.js inject 2
  node scripts/context-manager.js update 1 ./data/chapter-1-output.json
  node scripts/context-manager.js report
  node scripts/context-manager.js validate
    `);
}
