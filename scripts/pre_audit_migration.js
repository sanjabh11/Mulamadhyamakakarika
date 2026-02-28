import fs from 'fs/promises';
import path from 'path';

const publicDir = 'public';
const backupDir = path.join(publicDir, 'backup');
const reportFile = 'migration_audit.md';
const excludedDirs = new Set(['Ch5', 'Ch26', 'backup', 'assets', 'common', 'lib', 'libs', 'chapters']);

async function checkFileContent(filePath, checks) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return checks.every(check => content.includes(check));
    } catch (error) {
        // If file read fails, content check fails
        return false;
    }
}

async function checkJsFilesForCreateExport(dirPath) {
    let foundFiles = [];
    let hasCreateExport = false;
    try {
        const files = await fs.readdir(dirPath);
        const jsFiles = files.filter(file => file.endsWith('.js') && file !== 'config.js');
        foundFiles = jsFiles; // Store the names

        if (jsFiles.length === 0) {
            return { exists: false, hasExport: false, filenames: [] }; // No JS files found
        }

        for (const jsFile of jsFiles) {
            const filePath = path.join(dirPath, jsFile);
            if (await checkFileContent(filePath, ['export function create'])) {
                hasCreateExport = true; // Found at least one file with the export
                // Don't break here, we want the full list of filenames
            }
        }
        return { exists: true, hasExport: hasCreateExport, filenames: foundFiles };
    } catch (error) {
        return { exists: false, hasExport: false, filenames: [] }; // Error reading directory
    }
}

async function runAudit() {
    const auditResults = [];
    let targetDirs = [];

    console.log(`Starting migration audit...`);

    try {
        const allPublicDirs = await fs.readdir(publicDir, { withFileTypes: true });
        targetDirs = allPublicDirs
            .filter(dirent => dirent.isDirectory() && !excludedDirs.has(dirent.name))
            .map(dirent => dirent.name);

        console.log(`Found potential target chapters: ${targetDirs.join(', ')}`);

    } catch (error) {
        console.error(`Error reading public directory: ${error.message}`);
        return;
    }

    for (const targetDirName of targetDirs) {
        const result = {
            chapter: targetDirName,
            sourceDir: path.join(backupDir, targetDirName),
            status: 'Unknown',
            details: []
        };

        let sourceDirExists = false;
        let configJsExists = false;
        let configContentOk = false;
        let jsFilesResult = { exists: false, hasExport: false };

        // 1. Check Source Directory
        try {
            await fs.stat(result.sourceDir);
            sourceDirExists = true;
        } catch (error) {
            result.status = 'Missing Source Dir';
            result.details.push(`Backup directory not found at ${result.sourceDir}`);
            auditResults.push(result);
            continue; // Skip further checks if source dir is missing
        }

        // 2. Check config.js existence
        const configPath = path.join(result.sourceDir, 'config.js');
        try {
            await fs.stat(configPath);
            configJsExists = true;
        } catch (error) {
            result.details.push('config.js not found in source directory.');
        }

        // 3. Check config.js content
        if (configJsExists) {
            configContentOk = await checkFileContent(configPath, ['export const verses']);
            if (!configContentOk) {
                result.details.push('config.js does not contain "export const verses".');
            }
        }

        // 4. Check for other JS files and 'export function create'
        jsFilesResult = await checkJsFilesForCreateExport(result.sourceDir);
        if (!jsFilesResult.exists) {
            result.details.push('No .js files (excluding config.js) found.');
        } else {
            // Add found JS filenames to details
            result.details.push(`Found JS: ${jsFilesResult.filenames.join(', ') || 'None'}`);
            if (!jsFilesResult.hasExport) {
                result.details.push('None contain "export function create".');
            }
        }


        // Determine final status
        if (sourceDirExists && configJsExists && configContentOk && jsFilesResult.exists && jsFilesResult.hasExport) {
            result.status = 'Ready';
        } else {
            // Construct a more specific status based on failures
            if (!configJsExists) result.status = 'Missing Config';
            else if (!configContentOk) result.status = 'Config Issue';
            else if (!jsFilesResult.exists) result.status = 'Missing JS';
            else if (!jsFilesResult.hasExport) result.status = 'Animation Func Issue';
            else result.status = 'Multiple Issues'; // Fallback
        }

        auditResults.push(result);
    }

    // Format Report
    let reportContent = `# Migration Pre-Audit Report\n\n`;
    reportContent += `Audit Timestamp: ${new Date().toISOString()}\n\n`;
    // Increased padding for Details column
    reportContent += `| Chapter          | Source Directory                 | Status               | Details                                                              |\n`;
    reportContent += `|------------------|----------------------------------|----------------------|----------------------------------------------------------------------|\n`;

    auditResults.sort((a, b) => {
        // Basic sort to group Ready items
        if (a.status === 'Ready' && b.status !== 'Ready') return -1;
        if (a.status !== 'Ready' && b.status === 'Ready') return 1;
        return a.chapter.localeCompare(b.chapter); // Sort alphabetically otherwise
    });

    auditResults.forEach(res => {
        // Increased padding for Details column
        reportContent += `| ${res.chapter.padEnd(16)} | ${res.sourceDir.padEnd(32)} | ${res.status.padEnd(20)} | ${res.details.join('; ').padEnd(68)} |\n`;
    });

    // Write Report
    try {
        await fs.writeFile(reportFile, reportContent);
        console.log(`Audit complete. Report written to ${reportFile}`);
    } catch (error) {
        console.error(`Error writing report file: ${error.message}`);
    }
}

runAudit();