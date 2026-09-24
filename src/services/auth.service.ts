import api from "@/lib/axios";
import { LoginCredentials, User } from "@/types/auth";

export const authService = {
  /**
   * Log in user with username & password
   * POST https://dummyjson.com/auth/login
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post<User>("/auth/login", credentials);
    return response.data;
  },
};

export default authService;
