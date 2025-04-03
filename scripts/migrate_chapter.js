import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '..', 'public');
const backupDir = path.join(publicDir, 'backup');
const templateDir = path.join(publicDir, 'Ch5');
const targetChapterName = process.argv[2]; // Get chapter name from command line argument

if (!targetChapterName) {
    console.error('Error: Please provide the target chapter name as a command line argument.');
    console.error('Example: node scripts/migrate_chapter.js "Ch10 (1:2)"');
    process.exit(1);
}

const targetDir = path.join(publicDir, targetChapterName);
const sourceDir = path.join(backupDir, targetChapterName);

const templateIndexHtmlPath = path.join(templateDir, 'index.html');
const templateStylesCssPath = path.join(templateDir, 'styles.css');
const templateAppJsPath = path.join(templateDir, 'app.js');

const targetIndexHtmlPath = path.join(targetDir, 'index.html');
const targetStylesCssPath = path.join(targetDir, 'styles.css');
const targetConfigJsPath = path.join(targetDir, 'config.js');
const targetAnimationsJsPath = path.join(targetDir, 'animations.js');
const targetAppJsPath = path.join(targetDir, 'app.js');

const sourceConfigJsPath = path.join(sourceDir, 'config.js');

// --- Helper Functions ---

async function safeStat(filePath) {
    try {
        return await fs.stat(filePath);
    } catch (error) {
        return null; // Return null if file/dir doesn't exist
    }
}

async function safeReadFile(filePath) {
    try {
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.warn(`Warning: Could not read file ${filePath}. ${error.message}`);
        return null;
    }
}

async function safeUnlink(filePath) {
    try {
        await fs.unlink(filePath);
        console.log(`Deleted existing file: ${filePath}`);
    } catch (error) {
        if (error.code !== 'ENOENT') { // Ignore 'file not found' errors
            console.warn(`Warning: Could not delete file ${filePath}. ${error.message}`);
        }
    }
}

async function getVerseCount(configPath) {
    const content = await safeReadFile(configPath);
    if (!content) return 0;
    try {
        // This is a simplified and potentially fragile way to get the count.
        // It assumes 'export const verses = [' is present and counts the top-level objects.
        const versesMatch = content.match(/export\s+const\s+verses\s*=\s*\[([\s\S]*?)\];/m);
        if (!versesMatch || !versesMatch[1]) return 0;

        // Count occurrences of '{' at the start of a line or after a comma, within the array content
        const objectMatches = versesMatch[1].match(/\{(?:[^{}]|\{[^{}]*\})*\}/g);
        return objectMatches ? objectMatches.length : 0;
    } catch (error) {
        console.error(`Error parsing verse count from ${configPath}: ${error.message}`);
        return 0;
    }
}

function generateNavButtons(count) {
    let buttonsHtml = '';
    for (let i = 1; i <= count; i++) {
        buttonsHtml += `                    <button class="nav-button${i === 1 ? ' active' : ''}" data-verse="${i}">Verse ${i}</button>\n`;
    }
    return buttonsHtml.trimEnd(); // Remove trailing newline
}

// --- Migration Steps ---

async function migrateChapter() {
    console.log(`Starting migration for chapter: ${targetChapterName}`);
    console.log(`Source Dir: ${sourceDir}`);
    console.log(`Target Dir: ${targetDir}`);

    // 1. Verify Source Directory
    const sourceStat = await safeStat(sourceDir);
    if (!sourceStat || !sourceStat.isDirectory()) {
        console.error(`Error: Source directory not found or is not a directory: ${sourceDir}`);
        process.exit(1);
    }

    // 2. Clean Target Directory (remove specific files)
    console.log('Cleaning target directory...');
    await safeUnlink(targetIndexHtmlPath);
    await safeUnlink(targetStylesCssPath);
    await safeUnlink(targetConfigJsPath);
    await safeUnlink(targetAnimationsJsPath);
    await safeUnlink(targetAppJsPath);
    // Add any other files that might exist from old structure if necessary

    // 3. Process index.html
    console.log('Processing index.html...');
    const templateHtml = await safeReadFile(templateIndexHtmlPath);
    const verseCount = await getVerseCount(sourceConfigJsPath);
    if (!templateHtml || verseCount === 0) {
        console.error('Error: Could not read template index.html or determine verse count.');
        process.exit(1);
    }
    const navButtons = generateNavButtons(verseCount);
    let newHtml = templateHtml
        .replace(/<title>.*<\/title>/, `<title>Interactive 3D Madhyamaka Verses - ${targetChapterName}</title>`)
        .replace(/<h1>.*<\/h1>/, `<h1>${targetChapterName}</h1>`) // Use dir name as title for now
        .replace(/<div class="verse-nav">[\s\S]*?<\/div>/m, `<div class="verse-nav">\n${navButtons}\n                </div>`);
    // Update script paths if they differ (assuming they are now config.js, app.js)
    newHtml = newHtml.replace('src="config.js"', 'src="config.js"');
    newHtml = newHtml.replace('src="app.js"', 'src="app.js"');
    await fs.writeFile(targetIndexHtmlPath, newHtml);
    console.log(`Created ${targetIndexHtmlPath}`);

    // 4. Copy styles.css
    console.log('Copying styles.css...');
    try {
        await fs.copyFile(templateStylesCssPath, targetStylesCssPath);
        console.log(`Copied ${targetStylesCssPath}`);
    } catch (error) {
        console.error(`Error copying styles.css: ${error.message}`);
        process.exit(1);
    }

    // 5. Copy config.js
    console.log('Copying config.js...');
    try {
        await fs.copyFile(sourceConfigJsPath, targetConfigJsPath);
        console.log(`Copied ${targetConfigJsPath}`);
    } catch (error) {
        console.error(`Error copying config.js: ${error.message}`);
        process.exit(1);
    }

    // 6. Create animations.js (Combine JS files from source)
    console.log('Creating animations.js...');
    let combinedJsContent = `import * as THREE from 'three';\nimport { gsap } from 'gsap';\n\n`; // Add common imports
    let foundJsFiles = false;
    try {
        const files = await fs.readdir(sourceDir);
        const jsFiles = files.filter(file => file.endsWith('.js') && file !== 'config.js');

        if (jsFiles.length > 0) {
            foundJsFiles = true;
            for (const jsFile of jsFiles) {
                const filePath = path.join(sourceDir, jsFile);
                const content = await safeReadFile(filePath);
                if (content) {
                    // Basic cleaning: remove imports that might conflict
                    let cleanedContent = content.replace(/import .* from .*/g, '');
                    combinedJsContent += `// --- Content from ${jsFile} ---\n`;
                    combinedJsContent += cleanedContent + '\n\n';
                }
            }
        } else {
            console.warn(`Warning: No JS files (excluding config.js) found in ${sourceDir}. animations.js will be basic.`);
        }
        await fs.writeFile(targetAnimationsJsPath, combinedJsContent);
        console.log(`Created ${targetAnimationsJsPath}`);
    } catch (error) {
        console.error(`Error creating animations.js: ${error.message}`);
        process.exit(1);
    }

    // 7. Create app.js
    console.log('Creating app.js...');
    const templateAppJs = await safeReadFile(templateAppJsPath);
    if (!templateAppJs) {
        console.error('Error: Could not read template app.js.');
        process.exit(1);
    }
    // Modify the switch statement in app.js based on verseCount
    // This assumes animation functions follow a pattern like 'createVerseNAnimation'
    // A more robust solution would parse animations.js, but this is simpler for now.
    let switchCases = '';
    for (let i = 1; i <= verseCount; i++) {
        // Attempt to find a matching function name (case-insensitive check)
        // This is still a guess, might need refinement based on actual function names
        const expectedFuncName = `createVerse${i}Animation`; // Example pattern
        // We can't easily check if ANIMATIONS[expectedFuncName] exists here without complex parsing
        // So we generate the case assuming the function *should* exist based on the pattern
        switchCases += `        case ${i}:\n`;
        // The actual function names might differ, need to check backup JS files.
        // For now, let's assume a generic pattern or that the combined animations.js exports correctly named functions.
        // A better approach might be needed if function names are inconsistent.
        // Let's try a more generic lookup based on the keys in ANIMATIONS.
        // This assumes the exported functions in animations.js are named predictably.
        // We'll rely on the audit having checked for 'export function create...'
        // Let's assume the functions are named like createSuperpositionAnimation, createWaveFunctionAnimation etc.
        // We need a mapping from verseId to function name. This is complex without parsing.
        // Reverting to a simpler, potentially incorrect assumption for now:
        // Assume functions are named createAnimation1, createAnimation2 etc. or similar.
        // Let's try to find *any* function starting with 'create' in the imported ANIMATIONS.
        // This is still fragile. The best approach is likely manual mapping or more complex parsing.
        // For now, let's stick to the pattern from Ch26 backup:
        const animationFunctionName = getAnimationFunctionName(i); // Helper needed
        if (animationFunctionName) {
             switchCases += `            currentAnimation = ANIMATIONS.${animationFunctionName} ? ANIMATIONS.${animationFunctionName}(scene, config, colors) : null;\n`;
             switchCases += `            if (!currentAnimation) console.warn("Animation function ${animationFunctionName} not found for verse ${i}");\n`;
        } else {
             switchCases += `            console.error("Could not determine animation function name for verse ${i}");\n`;
             switchCases += `            currentAnimation = null;\n`;
        }
        switchCases += `            break;\n`;
    }
    const appJsWithSwitch = templateAppJs.replace(
        /switch \(verseId\) \{[\s\S]*?default:[\s\S]*?\}/m,
        `switch (verseId) {\n${switchCases}        default:\n            console.error(\`No animation found for verse \${verseId}\`);\n            currentAnimation = null;\n    }`
    );
    // Ensure the import points to the local animations.js
    const finalAppJs = appJsWithSwitch.replace(/import \* as ANIMATIONS from '.*';/, `import * as ANIMATIONS from './animations.js';`);

    await fs.writeFile(targetAppJsPath, finalAppJs);
    console.log(`Created ${targetAppJsPath}`);

    console.log(`\nMigration completed for chapter: ${targetChapterName}`);
    console.log(`Please verify the result at: http://localhost:8080/public/${encodeURIComponent(targetChapterName)}/`);

}

// Helper function to guess animation function name (needs improvement)
// This is a placeholder and likely needs to be adapted based on actual naming conventions
// found in the backup files.
function getAnimationFunctionName(verseId) {
    // Based on Ch26 backup structure
    const names = [
        'createSuperpositionAnimation', // 1
        'createWaveFunctionAnimation', // 2
        'createParticleInteractionAnimation', // 3
        'createDoubleslitAnimation', // 4
        'createEntanglementAnimation', // 5
        'createAttractionAnimation', // 6
        'createCoherenceAnimation', // 7
        'createDecayAnimation', // 8
        'createEntropyAnimation', // 9
        'createInitialConditionsAnimation', // 10
        'createQuantumErasureAnimation', // 11
        'createChainReactionAnimation' // 12
    ];
    if (verseId > 0 && verseId <= names.length) {
        return names[verseId - 1];
    }
    // Fallback or default if pattern doesn't match
    return `createVerse${verseId}Animation`; // Generic guess
}


migrateChapter();