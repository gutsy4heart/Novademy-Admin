import axios from 'axios';
import apiClient from './apiClient';

// User type definition
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

// Login function
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post<AuthResponse>(`${apiClient.defaults.baseURL}/auth/login`, {
      email,
      password
    });
    
    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Yanlış e-poçt və ya şifrə');
      } else if (error.response.status === 403) {
        throw new Error('Bu portal yalnız admin istifadəçilər üçündür');
      }
    }
    throw new Error('Giriş zamanı xəta baş verdi. Zəhmət olmasa sonra yenidən cəhd edin');
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (user && user.id) {
      await apiClient.post(`/auth/logout/${user.id}`);
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('admin_user');
  if (userStr) {
    return JSON.parse(userStr) as User;
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('admin_token');
};

// Set auth token for axios requests
export const setAuthToken = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Export auth service as default
const authService = {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  setAuthToken
};

export default authService; 