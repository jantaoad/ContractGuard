import { User } from '@/types';
import { storageService } from './storageService';

const CURRENT_USER_KEY = 'currentUser';

export const authService = {
  async signup(email: string, password: string, name: string): Promise<User> {
    const key = `user_${email}`;
    const stored = await storageService.get(key);

    if (stored) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'operator',
      organizationId: 'org-1',
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storageService.set(key, JSON.stringify(newUser));
    // Automatically log in after signup
    await this.setCurrentUser(newUser);
    return newUser;
  },

  async login(email: string, password: string): Promise<User> {
    const key = `user_${email}`;
    const stored = await storageService.get(key);

    if (!stored) {
      throw new Error('User not found');
    }

    const userData = JSON.parse(stored.value) as User;

    if (userData.password !== password) {
      throw new Error('Invalid password');
    }

    // Persist the current user
    await this.setCurrentUser(userData);
    return userData;
  },

  async setCurrentUser(user: User): Promise<void> {
    await storageService.set(CURRENT_USER_KEY, JSON.stringify(user));
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const stored = await storageService.get(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored.value) : null;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await storageService.remove(CURRENT_USER_KEY);
  },
};
