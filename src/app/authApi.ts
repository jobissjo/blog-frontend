import { LoginRequest } from "@/types/user";
import apiClient from "./api";

export const login = (data: LoginRequest) => {
  return apiClient.post("api/auth/login", data);
};


