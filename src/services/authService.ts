import { User } from "@/types/blog";
import { login as loginApi } from "@/lib/authApi";
import { LoginRequest } from "@/types/user";

export const authService = {
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const accessToken = localStorage.getItem("access_token");
    return !!accessToken;
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.isAdmin || false;
  },

  login: async (data: LoginRequest): Promise<{ access_token: string; refresh_token: string; isAdmin: boolean }> => {
    try {
      const response = await loginApi(data);
      const { success, data: loginData } = response.data;
      
      if (success && loginData) {
        localStorage.setItem("access_token", loginData.access_token);
        localStorage.setItem("refresh_token", loginData.refresh_token);
        
        const user: User = {
          id: "user",
          isAdmin: loginData.isAdmin,
        };
        localStorage.setItem("user", JSON.stringify(user));
        
        // Dispatch custom event to notify components of auth state change
        window.dispatchEvent(new Event("auth-change"));
        
        return loginData;
      }
      
      throw new Error("Login failed");
    } catch (error) {
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    
    // Dispatch custom event to notify components of auth state change
    window.dispatchEvent(new Event("auth-change"));
    
    window.location.href = "/";
  },
};
