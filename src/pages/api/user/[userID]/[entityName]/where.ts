import { Users } from "@server/db";
import {
  catchErrors,
  createValidatorFromJson,
  CrudifyError,
  ErrorResponse,
  getValidator,
  nanoid,
  parseNStringify,
  toMethods,
} from "@server/utils";
import { z } from "zod";

// /user/:userID/:entityName/where
export default toMethods({
  POST: catchErrors(async (req, res) => {
    const { userID, entityName } = req.query;
    const clauses = parseNStringify(req.body);
    const matchObj = Object.fromEntries(
      Object.entries(clauses).map(([k, v]: [string, any]) => [
        `entities.data.${k}`,
        v,
      ])
    );
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
          $unwind: { path: "$entities.data" },
        },
        {
          $match: matchObj,
        },
        {
          $project: { "entities.data": 1 },
        },
      ])
      .toArray();
    if (!result) {
      throw new CrudifyError("not found");
    }
    res.send(result.entities.data);
  }),
});
