import { Users } from "@server/db";
import {
  catchErrors,
  createValidatorFromJson,
  CrudifyError,
  ErrorResponse,
  nanoid,
  toMethods,
} from "@server/utils";
import { z } from "zod";

// /user/:userID/:entityName/validator
export default toMethods({
  GET: catchErrors(async (req, res) => {
    const { userID, entityName } = req.query;
    const { connection, collection } = await Users();
    const [result] = await collection
      .aggregate([
        {
          $match: { $or: [{ userID }, { slug: userID }] },
        },
        {
          $unwind: { path: "$entities" },
        },
        {
          $match: { "entities.name": entityName },
        },
        {
          $project: { "entities.validator": 1, "entities.name": 1 },
        },
      ])
      .toArray();
    res.send(result as any);
  }),
});
