import { Users } from "@server/db";
import {
  catchErrors,
  ErrorResponse,
  nanoid,
  requireAuth,
  toMethods,
  CrudifyError,
} from "@server/utils";

//  /user
export default toMethods({
  GET: catchErrors(async (req, res) => {
    const { collection } = await Users();
    const result = await collection
      .aggregate([
        {
          $project: {
            name: 1,
            slug: 1,
            userID: 1,
            "entities.name": 1,
          },
        },
      ])
      .toArray();
    return res.status(200).json(result);
  }),
});
