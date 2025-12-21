import { LoginRequest, ChangePasswordRequest } from "@/types/user";
import apiClient from "./api";

export const login = (data: LoginRequest) => {
  return apiClient.post("api/auth/login", data);
};

export const changePassword = (data: ChangePasswordRequest) => {
  return apiClient.post("api/auth/change-password", data);
};


