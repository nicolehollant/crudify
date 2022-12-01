import {
  generateAccessToken,
  isAuthenticatedInPool,
  transporter,
} from "@server/auth";
import { Users } from "@server/db";
import { signInEmail } from "@server/email";
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
import jwt from "jsonwebtoken";
import { z } from "zod";
/** 

  /user/:userID/userPool/:userPoolName/account

*/
export default toMethods({
  GET: catchErrors(async (req, res) => {
    const { email, userID, userPoolName } = isAuthenticatedInPool(req);
    const { collection } = await Users();
    const [existingAccount] = await collection
      .aggregate([
        {
          $match: { $or: [{ userID }, { slug: userID }] },
        },
        {
          $unwind: {
            path: "$userPools",
          },
        },
        {
          $match: {
            "userPools.name": userPoolName,
          },
        },
        {
          $project: {
            "userPools.users": 1,
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "userPools.users.email": email,
          },
        },
        {
          $project: {
            "userPools.users": 1,
          },
        },
      ])
      .toArray();
    if (!existingAccount?.userPools?.users?.[0]) {
      const account = z
        .object({
          id: z.string(),
          avatar: z.string().nullable(),
          email: z.string(),
          data: z.any(),
        })
        .parse({
          id: nanoid(),
          avatar: "",
          email: email,
          data: {},
        });
      const updateResult = await collection.updateOne(
        { $or: [{ userID }, { slug: userID }] },
        {
          $push: {
            "userPools.$[userPool].users": account,
          },
        },
        {
          arrayFilters: [{ "userPool.name": userPoolName }],
        }
      );
      if (updateResult?.modifiedCount > 0) {
        return res.send({
          message: "Success",
          checks: {
            isAuthorized: true,
            isNewAccount: true,
          },
          ...account,
        });
      } else {
        throw new CrudifyError("Failed to add account", 500, updateResult);
      }
    }

    return res.send({
      message: "Success",
      checks: {
        isAuthorized: true,
        isNewAccount: false,
      },
      ...existingAccount.userPools.users[0],
    });
  }),
  PUT: catchErrors(async (req, res) => {
    const { email, userID, userPoolName } = isAuthenticatedInPool(req);
    const { avatar, data } = parseNStringify(req.body);
    if (!avatar && !data) {
      return res.send("Unchanged");
    }
    const { connection, collection } = await Users();
    const [existingAccount] = await collection
      .aggregate([
        {
          $match: { $or: [{ userID }, { slug: userID }] },
        },
        {
          $unwind: {
            path: "$userPools",
          },
        },
        {
          $match: {
            "userPools.name": userPoolName,
          },
        },
        {
          $project: {
            "userPools.users": 1,
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "userPools.users.email": email,
          },
        },
        {
          $project: {
            "userPools.users": 1,
          },
        },
      ])
      .toArray();
    if (!existingAccount?.userPools?.users?.[0]) {
      throw new CrudifyError("Not found", 404);
    }
    const updateData = {
      ...existingAccount.userPools.users[0],
    };
    if (data) {
      updateData.data = data;
    }
    if (avatar) {
      updateData.avatar = avatar;
    }
    const result = await collection.updateOne(
      { $or: [{ userID }, { slug: userID }] },
      {
        $set: {
          "userPools.$[userPool].users.$[position]": updateData,
        },
      },
      {
        arrayFilters: [
          { "userPool.name": userPoolName },
          { "position.email": email },
        ],
      }
    );
    if (result.modifiedCount > 0) {
      return res.send({ message: "Success", data });
    }
    res.status(400).send({ error: "Invalid" });
  }),
});
