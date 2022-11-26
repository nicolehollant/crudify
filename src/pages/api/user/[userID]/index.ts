import { Accounts, Users } from "@server/db";
import {
  catchErrors,
  CrudifyError,
  ErrorResponse,
  nanoid,
  toMethods,
} from "@server/utils";

export default toMethods({
  // GET /user
  GET: catchErrors(async (req, res) => {
    let { userID } = req.query;
    if (!userID) {
      res.status(400).send(ErrorResponse("Missing params"));
      return;
    }
    const { connection, collection } = await Users();
    const accounts = await Accounts();
    const [result] = await collection
      .aggregate([
        {
          $match: { $or: [{ userID }, { slug: userID }] },
        },
        {
          $project: {
            email: 1,
            slug: 1,
            name: 1,
            userID: 1,
            "entities.name": 1,
          },
        },
      ])
      .toArray();
    if (!result) {
      throw new CrudifyError("not found");
    }
    const account = await accounts.collection.findOne({ email: result.email });
    if (account?.image) {
      result.image = account.image;
    }
    return res.status(200).json(result as any);
  }),
});
