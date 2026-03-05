/**
 * PersistentMap
 *
 * A file-backed key-value store for server-side state namespacing.
 * Written atomically to prevent data corruption.
 *
 * PRODUCTION NOTE: Replace with Vercel KV, Upstash Redis, or a database
 * for multi-instance production deployments.
 */

import fs from 'fs';
import path from 'path';

const STATE_DIR = process.env.PERSISTENT_MAP_DIR || path.join(process.cwd(), '.state');

export class PersistentMap {
    constructor(namespace) {
        this.namespace = namespace;
        this.filePath = path.join(STATE_DIR, `${namespace}.json`);
        this._ensureDir();
    }

    _ensureDir() {
        if (!fs.existsSync(STATE_DIR)) {
            fs.mkdirSync(STATE_DIR, { recursive: true });
        }
    }

    _read() {
        try {
            if (!fs.existsSync(this.filePath)) return {};
            const raw = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(raw);
        } catch {
            return {};
        }
    }

    _write(data) {
        // Atomic write via temp file + rename
        const tmp = `${this.filePath}.tmp`;
        fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
        fs.renameSync(tmp, this.filePath);
    }

    async get(key) {
        const data = this._read();
        return data[key] ?? null;
    }

    async set(key, value) {
        const data = this._read();
        data[key] = value;
        this._write(data);
        return value;
    }

    async delete(key) {
        const data = this._read();
        delete data[key];
        this._write(data);
    }

    async has(key) {
        const data = this._read();
        return key in data;
    }

    async all() {
        return this._read();
    }

    async clear() {
        this._write({});
    }
}

export default PersistentMap;
