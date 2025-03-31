// migration-logger.js
export class MigrationLogger {
  constructor(chapterName) {
    this.chapterName = chapterName;
    this.logs = {
      info: [],
      warnings: [],
      errors: [],
      success: []
    };
    this.startTime = Date.now();
  }

  info(message) {
    console.info(`[${this.chapterName}] INFO: ${message}`);
    this.logs.info.push({
      timestamp: Date.now(),
      message
    });
  }

  warn(message) {
    console.warn(`[${this.chapterName}] WARNING: ${message}`);
    this.logs.warnings.push({
      timestamp: Date.now(),
      message
    });
  }

  error(message, error = null) {
    console.error(`[${this.chapterName}] ERROR: ${message}`, error);
    this.logs.errors.push({
      timestamp: Date.now(),
      message,
      error: error ? error.toString() : null
    });
  }

  success(message) {
    console.log(`[${this.chapterName}] SUCCESS: ${message}`);
    this.logs.success.push({
      timestamp: Date.now(),
      message
    });
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    return {
      chapter: this.chapterName,
      duration: `${(duration / 1000).toFixed(2)}s`,
      totalInfos: this.logs.info.length,
      totalWarnings: this.logs.warnings.length,
      totalErrors: this.logs.errors.length,
      totalSuccess: this.logs.success.length,
      status: this.logs.errors.length === 0 ? 'SUCCESS' : 'FAILED',
      logs: this.logs
    };
  }

  saveReport() {
    const report = this.generateReport();
    // In browser context, save to localStorage or download as JSON
    try {
        localStorage.setItem(`migration-report-${this.chapterName}`, JSON.stringify(report));
        this.info(`Report saved to localStorage for ${this.chapterName}`);
    } catch (e) {
        this.error(`Failed to save report to localStorage for ${this.chapterName}`, e);
    }
    return report;
  }
}