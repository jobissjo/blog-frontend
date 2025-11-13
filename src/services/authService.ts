import { User } from "@/types/blog";

// Mock auth service - replace with real auth later
let currentUser: User | null = {
  id: "admin-1",
  isAdmin: true, // Change to false to see public view
};

export const authService = {
  getCurrentUser: (): User | null => {
    return currentUser;
  },

  isAdmin: (): boolean => {
    return currentUser?.isAdmin || false;
  },

  login: (isAdmin: boolean): User => {
    currentUser = {
      id: isAdmin ? "admin-1" : "user-1",
      isAdmin,
    };
    return currentUser;
  },

  logout: (): void => {
    currentUser = null;
  },
};
