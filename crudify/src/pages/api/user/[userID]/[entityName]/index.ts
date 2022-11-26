import { Users } from "@server/db";
import {
  catchErrors,
  createValidatorFromJson,
  CrudifyError,
  ErrorResponse,
  getValidator,
  nanoid,
  toMethods,
} from "@server/utils";
import { z } from "zod";

// /user/:userID/:entityName
export default toMethods({
  GET: catchErrors(async (req, res) => {
    let { userID, entityName } = req.query;
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
          $project: { "entities.data": 1 },
        },
      ])
      .toArray();
    if (!result) {
      throw new CrudifyError("not found");
    }
    res.send(result.entities.data);
  }),
  POST: catchErrors(async (req, res) => {
    const { userID, entityName } = req.query;
    const _validator = await getValidator(String(userID), String(entityName));
    const validator = z.object(
      createValidatorFromJson(_validator?.entities.validator)
    );
    const id = nanoid();
    const parsed = await validator.parseAsync(JSON.parse(req.body));
    if (!Object.keys(parsed ?? {}).length) {
      res.status(400).send({ error: "Invalid" });
      return;
    }
    const data = {
      id,
      ...parsed,
    };
    const { connection, collection } = await Users();
    const result = await collection.updateOne(
      { $or: [{ userID }, { slug: userID }] },
      {
        $push: {
          "entities.$[entity].data": data,
        },
      },
      {
        arrayFilters: [{ "entity.name": entityName }],
      }
    );
    if (result.modifiedCount > 0) {
      return res.send({ message: "Success", data });
    }
    res.status(400).send({ error: "Invalid" });
    return;
  }),
});
