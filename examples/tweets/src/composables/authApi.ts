import { z } from "zod";

const BASEURL =
  "https://crudify.app/api/user/iTduz8WS9Cug4-cH/userPool/Twittify";

export const authApi = {
  /**
   * Requests a magic link email
   */
  async signIn(data: { email: string }) {
    const response = await request.post<{ email: string }, { message: string }>(
      BASEURL + "/login",
      data
    );
    return response;
  },
  /**
   * Refresh auth token
   */
  async refresh(data: { refreshToken?: string }, authToken: string) {
    const response = await request.post<
      { refreshToken?: string },
      { refreshToken: string; accessToken: string }
    >(BASEURL + "/refresh", data, {
      headers: {
        Authorization: authToken,
      },
    });
    return response;
  },
  /**
   * Get account
   */
  async getAccount(authToken: string) {
    const response = await request.get<{
      message: string;
      checks: {
        isAuthorized: boolean;
        isNewAccount: boolean;
      };
      id: string;
      avatar: string;
      email: string;
      data: any;
    }>(BASEURL + "/account", {
      headers: {
        Authorization: authToken,
      },
    });
    return response;
  },
  /**
   * Update account
   */
  async updateAccount(
    data: { avatar?: string; data?: any },
    authToken: string
  ) {
    const response = await request.put<
      { avatar?: string; data?: any },
      { message: string }
    >(BASEURL + "/account", data, {
      headers: {
        Authorization: authToken,
      },
    });
    return response;
  },
};
