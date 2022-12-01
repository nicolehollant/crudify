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

  /user/:userID/userPool/:userPoolName

*/
export default toMethods({
  GET: catchErrors(async (req, res) => {
    const { userID, userPoolName } = req.query;

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
          $unwind: { path: "$userPools" },
        },
        {
          $match: { "userPools.name": userPoolName },
        },
        {
          $project: {
            "userPools.id": 1,
            "userPools.name": 1,
            "userPools.fromEmail": 1,
            "userPools.redirectUrl": 1,
            "userPools.users": 1,
          },
        },
      ])
      .toArray();
    if (!result) {
      throw new CrudifyError("not found");
    }
    res.send(result.userPools);
  }),
  PUT: catchErrors(async (req, res) => {
    const { userID, userPoolName } = req.query;
    const { name, redirectUrl, fromEmail } = parseNStringify(req.body);
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
    const [existing] = await collection
      .aggregate([
        {
          $match: { $or: [{ userID }, { slug: userID }] },
        },
        {
          $unwind: { path: "$userPools" },
        },
        {
          $match: { "userPools.name": userPoolName },
        },
        {
          $project: {
            "userPools.id": 1,
            "userPools.name": 1,
            "userPools.fromEmail": 1,
            "userPools.redirectUrl": 1,
          },
        },
      ])
      .toArray();
    if (!existing) {
      throw new CrudifyError("not found");
    }
    const updatePayload: any = {};
    if (fromEmail) {
      updatePayload["userPools.$[userPool].fromEmail"] = fromEmail;
    }
    if (redirectUrl) {
      updatePayload["userPools.$[userPool].redirectUrl"] = redirectUrl;
    }
    if (name) {
      updatePayload["userPools.$[userPool].name"] = name;
    }
    const result = await collection.updateOne(
      { $or: [{ userID }, { slug: userID }] },
      {
        $set: updatePayload,
      },
      {
        arrayFilters: [{ "userPool.name": userPoolName }],
      }
    );
    if (result.modifiedCount > 0) {
      return res.send({ message: "Success", data: updatePayload });
    }
    console.log({ result });
    res.status(400).send({ error: "Invalid" });
  }),
});
