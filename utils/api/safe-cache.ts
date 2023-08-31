interface SafeCacheConfig {
  /**
   * Seconds
   */
  expire?: number;
  prefix?: string;
  namespace?: string;
  fallback?: () => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type SafeCacheStore = Record<string, unknown>;

export class SafeCache {
  // eslint-disable-next-line no-use-before-define
  private static client: SafeCache;

  private store: SafeCacheStore;

  constructor(private readonly config?: SafeCacheConfig) {
    this.store = {} as SafeCacheStore;
    // eslint-disable-next-line no-param-reassign
    if (config?.expire) config.expire *= 1000;
    // eslint-disable-next-line no-console
    console.log(`SafeCache created with config: ${JSON.stringify(config)}`);
  }

  private getKey(key: string) {
    const { prefix, namespace } = this.config || {};
    return `${prefix || ''}${namespace || ''}${key}`;
  }

  private expireKey(key: string) {
    const realKey = this.getKey(key);
    if (this.config?.expire) {
      setTimeout(() => {
        delete this.store[realKey];
        // eslint-disable-next-line no-console
        console.log(`Key expired: ${realKey}`);
      }, this.config.expire);
    }
  }

  set(key: string, value: unknown) {
    const realKey = this.getKey(key);
    this.store[realKey] = value;
    this.expireKey(realKey);
    // eslint-disable-next-line no-console
    console.log(`Key set: ${realKey}`);
  }

  get<R>(key: string): R | null | unknown {
    const realKey = this.getKey(key);
    if (this.store[realKey]) {
      return this.store[realKey] as R;
    }

    if (this.config?.fallback) {
      return this.config.fallback();
    }
    return null;
  }

  remove(key: string) {
    const realKey = this.getKey(key);
    delete this.store[realKey];
  }

  destroy() {
    this.store = {} as SafeCacheStore;
  }

  static create(config?: SafeCacheConfig) {
    if (!this.client) {
      this.client = new SafeCache(config);
    }
    return this.client;
  }
}
