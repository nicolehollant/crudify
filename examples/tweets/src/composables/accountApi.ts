import { z } from "zod";

const BASEURL = "https://crudify.app/api/user/iTduz8WS9Cug4-cH/twittifyAccount";

const validator = z.object({
  avatar: z.string(),
  banner: z.string(),
  displayName: z.string(),
  userName: z.string(),
  bio: z.string(),
  following: z.array(z.any()),
  tweets: z.array(z.any()),
  followers: z.any(),
  createdAt: z.string(),
});

type GetAllResponse = (typeof validator._input & { id: string })[];
type PostRequest = typeof validator._input;
type PostResponse = typeof validator._input & { id: string };
type GetOneResponse = typeof validator._input & { id: string };
type PutRequest = typeof validator._input;
type PutResponse = typeof validator._input & { id: string };
type DeleteResponse = typeof validator._input & { id: string };

export const accountApi = {
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
