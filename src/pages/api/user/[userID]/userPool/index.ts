import { Users } from "@server/db";
import {
  catchErrors,
  createValidatorFromJson,
  CrudifyError,
  ErrorResponse,
  getEmailByIdentifier,
  nanoid,
  parseNStringify,
  requireAuthAsEmail,
  toMethods,
  UserPoolValidator,
} from "@server/utils";

/** 

  /user/:userID/userPool

*/
export default toMethods({
  GET: catchErrors(async (req, res) => {
    const { userID } = req.query;

    if (!userID) {
      res.status(400).send({
        error: "Missing params",
      });
      return;
    }
    // only allow getting userpools in your own account
    const userFromPathParam = await getEmailByIdentifier(String(userID));
    await requireAuthAsEmail(req, userFromPathParam);
    const { collection } = await Users();
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
            "userPools.name": 1,
          },
        },
      ])
      .toArray();
    if (!result) {
      throw new CrudifyError("not found");
    }
    return res.status(200).json(result as any);
  }),
  POST: catchErrors(async (req, res) => {
    const { userID } = req.query;
    const { name, fromEmail, redirectUrl } = parseNStringify(req.body);
    if (!userID || !name || !fromEmail || !redirectUrl) {
      res.status(400).send({
        error: "Missing params",
        userID,
        name,
        fromEmail,
        redirectUrl,
      });
      return;
    }
    // only allow adding entities in your own account
    const userFromPathParam = await getEmailByIdentifier(String(userID));
    await requireAuthAsEmail(req, userFromPathParam);
    const { collection } = await Users();
    const userPool = UserPoolValidator.parse({
      fromEmail,
      name,
      redirectUrl,
      id: nanoid(),
      users: [],
    });
    const [existing] = await collection
      .find({ $or: [{ userID }, { slug: userID }] })
      .project({ userPools: { $elemMatch: { name: userPool.name } }, _id: 0 })
      .toArray();
    if (Object.keys(existing ?? {}).length) {
      res
        .status(400)
        .send({ error: "UserPool already exists", data: existing });
      return;
    }
    const updated = await collection.updateOne(
      { $or: [{ userID }, { slug: userID }] },
      {
        $push: {
          userPools: userPool,
        },
      }
    );
    res.send(updated as any);
  }),
});
