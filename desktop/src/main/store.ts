import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { app } from 'electron';

interface StorageSchema {
  groqApiKey?: string;
  geminiApiKey?: string;
  resumeText?: string;
  jobDescription?: string;
  companyName?: string;
  candidateName?: string;
  modelMode?: 'fast' | 'balanced' | 'smart';
  language?: string;
  opacity?: number;
  clickThrough?: boolean;
  onboardingCompleted?: boolean;
  history?: Array<{
    id: string;
    timestamp: number;
    question: string;
    answer: string;
    model: string;
    category?: string;
  }>;
}

const ALGORITHM = 'aes-256-gcm';

export class EncryptedLocalStore {
  private filePath: string = '';
  private memoryCache: StorageSchema = {};
  private secret: Buffer | null = null;

  constructor() {
    try {
      const dir = app ? app.getPath('userData') : process.cwd();
      this.filePath = path.join(dir, 'parakeet_secure_config.enc');
      this.load();
      this.scheduleAutoPurge();
    } catch (e) {
      console.warn('[Store] Constructor init warning:', e);
    }
  }

  private getSecret(): Buffer {
    if (!this.secret) {
      try {
        const base = app ? app.getPath('userData') : 'parakeet_default_data';
        this.secret = crypto.createHash('sha256').update(base + '_parakeet_secure_salt_2026').digest();
      } catch {
        this.secret = crypto.createHash('sha256').update('parakeet_fallback_salt_2026').digest();
      }
    }
    return this.secret;
  }

  private encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, this.getSecret(), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return JSON.stringify({
      iv: iv.toString('hex'),
      authTag,
      content: encrypted,
    });
  }

  private decrypt(raw: string): string {
    try {
      const parsed = JSON.parse(raw);
      const iv = Buffer.from(parsed.iv, 'hex');
      const authTag = Buffer.from(parsed.authTag, 'hex');
      const decipher = crypto.createDecipheriv(ALGORITHM, this.getSecret(), iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(parsed.content, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      console.error('Failed to decrypt store, initializing clean state', e);
      return '{}';
    }
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const encryptedData = fs.readFileSync(this.filePath, 'utf-8');
        const decryptedJson = this.decrypt(encryptedData);
        this.memoryCache = JSON.parse(decryptedJson);
      } else {
        this.memoryCache = {
          modelMode: 'balanced',
          language: 'en',
          opacity: 90,
          clickThrough: false,
          onboardingCompleted: true,
          history: [],
        };
        this.save();
      }
    } catch (e) {
      console.error('Error loading encrypted store:', e);
      this.memoryCache = {};
    }
  }

  public save() {
    try {
      const json = JSON.stringify(this.memoryCache, null, 2);
      const encrypted = this.encrypt(json);
      fs.writeFileSync(this.filePath, encrypted, 'utf-8');
    } catch (e) {
      console.error('Error writing encrypted store:', e);
    }
  }

  public get<K extends keyof StorageSchema>(key: K): StorageSchema[K] {
    return this.memoryCache[key];
  }

  public getAll(): StorageSchema {
    return { ...this.memoryCache };
  }

  public set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]) {
    this.memoryCache[key] = value;
    this.save();
  }

  public update(patch: Partial<StorageSchema>) {
    this.memoryCache = { ...this.memoryCache, ...patch };
    this.save();
  }

  public scheduleAutoPurge() {
    const purge = () => {
      if (this.memoryCache.history && this.memoryCache.history.length > 0) {
        const now = Date.now();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const initialLen = this.memoryCache.history.length;
        this.memoryCache.history = this.memoryCache.history.filter(
          (item) => now - item.timestamp < ONE_DAY_MS
        );
        if (this.memoryCache.history.length !== initialLen) {
          console.log(`[Privacy Engine] Auto-purged ${initialLen - this.memoryCache.history.length} old transcripts.`);
          this.save();
        }
      }
    };

    purge();
    setInterval(purge, 60 * 60 * 1000);
  }
}
