import { z } from "zod";

const BASEURL = "https://crudify.app/api/user/iTduz8WS9Cug4-cH/twittify";
const AUTH_BASEURL =
  "https://crudify.app/api/user/iTduz8WS9Cug4-cH/userPool/Twittify";

const validator = z.object({
  tweetID: z.string(),
  username: z.string(),
  media: z.array(
    z.object({
      alt: z.string(),
      url: z.string(),
    })
  ),
  text: z.string(),
  likes: z.array(
    z.object({
      username: z.string(),
      displayName: z.string(),
      avatar: z.string(),
    })
  ),
  retweets: z.array(
    z.object({
      username: z.string(),
      displayName: z.string(),
      avatar: z.string(),
    })
  ),
  avatar: z.string(),
  replies: z.array(z.any()),
  displayName: z.string(),
});

export type GetAllResponse = (typeof validator._input & { id: string })[];
export type PostRequest = typeof validator._input;
export type PostResponse = typeof validator._input & { id: string };
export type GetOneResponse = typeof validator._input & { id: string };
export type PutRequest = typeof validator._input;
export type PutResponse = typeof validator._input & { id: string };
export type DeleteResponse = typeof validator._input & { id: string };

export const authApi = {
  /**
   * Requests a magic link email
   */
  async signIn(data: { email: string }) {
    const response = await request.post<{ email: string }, { message: string }>(
      AUTH_BASEURL + "/login",
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
    >(AUTH_BASEURL + "/refresh", data, {
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
    }>(AUTH_BASEURL + "/account", {
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
    >(AUTH_BASEURL + "/account", data, {
      headers: {
        Authorization: authToken,
      },
    });
    return response;
  },
};

export const api = {
  /**
   * Create an entity
   */
  async create(data: PostRequest) {
    const response = await request.post<PostRequest, PostResponse>(
      BASEURL,
      data
    );
    return response;
  },
  /**
   * Get all entities
   */
  async getAll() {
    const response = await request.get<GetAllResponse>(BASEURL);
    return response;
  },
  /**
   * Get one entity
   */
  async getOneByID(entityID: string) {
    const response = await request.get<GetOneResponse>(
      BASEURL + "/" + entityID
    );
    return response;
  },
  /**
   * Delete one entity
   */
  async deleteOneByID(entityID: string) {
    const response = await request.delete<DeleteResponse>(
      BASEURL + "/" + entityID
    );
    return response;
  },
  /**
   * Create an entity
   */
  async updateOne(entityID: string, data: PostRequest) {
    const response = await request.put<PutRequest, PutResponse>(
      BASEURL + "/" + entityID,
      data
    );
    return response;
  },
};

export const queryKeys = {
  getAll: "getAll",
  getOneByID: "getOneByID",
};

export const vueQueryParams = {
  getAll: () => ({
    queryKey: [queryKeys.getAll],
    queryFn: api.getAll,
  }),
  getOneByID: (entityID: string) => ({
    queryKey: [queryKeys.getOneByID],
    queryFn: () => api.getOneByID(entityID),
  }),
};
