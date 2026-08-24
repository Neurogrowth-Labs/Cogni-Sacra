// Auth Service - Connects to backend API

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://cogni-sacra-backend-production.up.railway.app';
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  accountType?: 'learner' | 'instructor';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface GoogleLoginPayload {
  credential: string;
  password?: string;
  accountType?: 'learner' | 'instructor';
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar_url?: string;
  isEmailVerified?: boolean;
  status?: string;
  institutionId?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
  message?: string;
}

// API response structure from backend
interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: AuthUser;
  };
}

// Store token in localStorage
const TOKEN_KEY = 'cogni_sacra_token';
const USER_KEY = 'cogni_sacra_user';

// Auth state change listeners
type AuthStateListener = (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED', user: AuthUser | null) => void;
const listeners = new Set<AuthStateListener>();

function notifyListeners(event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED', user: AuthUser | null) {
  listeners.forEach(cb => {
    try { cb(event, user); } catch (e) { console.error('Auth listener error:', e); }
  });
}

export const authService = {
  // Subscribe to auth state changes
  onAuthStateChange(callback: AuthStateListener) {
    listeners.add(callback);
    return { unsubscribe: () => listeners.delete(callback) };
  },

  // Register a new user
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const body = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword || payload.password,
      accountType: payload.accountType || 'learner',
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const apiResponse: ApiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      if (response.status === 409) {
        throw new Error('Email already registered');
      }
      if (response.status === 422) {
        throw new Error('Validation error. Please check your inputs.');
      }
      throw new Error(apiResponse.message || 'Registration failed');
    }

    const user = apiResponse.data?.user;
    const token = apiResponse.data?.token;

    if (!user) {
      throw new Error('Registration failed: No user data returned');
    }

    // Save token and user (token might not be returned if email verification required)
    if (token) {
      this.saveAuth(token, user);
      notifyListeners('SIGNED_IN', user);
    } else {
      this.saveUser(user);
    }

    return { user, token, message: apiResponse.message };
  },

  // Login user
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const apiResponse: ApiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      if (response.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (response.status === 403) {
        throw new Error(apiResponse.message || 'Account is not active');
      }
      throw new Error(apiResponse.message || 'Login failed');
    }

    const user = apiResponse.data?.user;
    const token = apiResponse.data?.token;

    if (!user || !token) {
      throw new Error('Login failed: Invalid response from server');
    }

    this.saveAuth(token, user);
    notifyListeners('SIGNED_IN', user);

    return { user, token, message: apiResponse.message };
  },

  // Google login
  async googleLogin(payload: GoogleLoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const apiResponse: ApiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      if (response.status === 409) {
        throw new Error(apiResponse.message || 'Account linking required');
      }
      throw new Error(apiResponse.message || 'Google login failed');
    }

    const user = apiResponse.data?.user;
    const token = apiResponse.data?.token;

    if (!user || !token) {
      throw new Error('Google login failed: Invalid response from server');
    }

    this.saveAuth(token, user);
    notifyListeners('SIGNED_IN', user);

    return { user, token, message: apiResponse.message };
  },

  // Forgot password
  async forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const apiResponse: ApiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      throw new Error(apiResponse.message || 'Failed to send reset email');
    }

    return apiResponse.message;
  },

  // Reset password
  async resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const apiResponse: ApiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      throw new Error(apiResponse.message || 'Failed to reset password');
    }

    const user = apiResponse.data?.user;
    if (!user) {
      throw new Error('Reset password failed: No user data returned');
    }

    return { user, message: apiResponse.message };
  },

  // Change password (authenticated)
  async changePassword(payload: ChangePasswordPayload): Promise<string> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const apiResponse: ApiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(apiResponse.message || 'Failed to change password');
    }

    return apiResponse.message;
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          return null;
        }
        throw new Error('Failed to get user');
      }

      const apiResponse: ApiResponse = await response.json();

      if (!apiResponse.success || !apiResponse.data) {
        this.logout();
        return null;
      }

      // /auth/me returns user data in data (could be data directly or data.user)
      const user: AuthUser = (apiResponse.data as any).id
        ? (apiResponse.data as unknown as AuthUser)
        : apiResponse.data.user!;
      this.saveUser(user);
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Save auth data
  saveAuth(token: string, user: AuthUser) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save auth to localStorage');
    }
  },

  // Save user only
  saveUser(user: AuthUser) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user to localStorage');
    }
  },

  // Get token
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  },

  // Get saved user
  getUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Logout
  logout() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Could not clear auth from localStorage');
    }
    notifyListeners('SIGNED_OUT', null);
  },
};

export default authService;
