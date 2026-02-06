// Simple storage service that wraps browser storage
// In production, this would interact with a backend API

export const storageService = {
  async get(key: string) {
    try {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    } catch (err) {
      console.error('Storage get failed:', err);
      throw err;
    }
  },

  async set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error('Storage set failed:', err);
      throw err;
    }
  },

  async remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Storage remove failed:', err);
      throw err;
    }
  },

  async clear() {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Storage clear failed:', err);
      throw err;
    }
  },
};

// Make it available globally like the original code
if (typeof window !== 'undefined') {
  (window as any).storage = storageService;
}
