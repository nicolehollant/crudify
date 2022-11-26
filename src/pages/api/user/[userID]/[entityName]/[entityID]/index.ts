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
import { Entity } from "~types/app";

// /user/:userID/:entityName/:entityID
export default toMethods({
  GET: catchErrors(async (req, res) => {
    const { userID, entityName, entityID } = req.query;
    const { connection, collection } = await Users();
    const [result] = await collection
      .aggregate([
        {
          $match: {
            userID: userID,
          },
        },
        {
          $unwind: {
            path: "$entities",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "entities.name": entityName,
          },
        },
        {
          $unwind: {
            path: "$entities.data",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "entities.data.id": entityID,
          },
        },
        {
          $project: {
            "entities.data": 1,
          },
        },
      ])
      .toArray();
    return res.send(result?.entities?.data);
  }),
  PUT: catchErrors(async (req, res) => {
    const { userID, entityName, entityID } = req.query;
    const _validator = await getValidator(String(userID), String(entityName));
    const validator = z.object(
      createValidatorFromJson(_validator?.entities.validator)
    );
    const parsed: any = await validator.parseAsync(JSON.parse(req.body));
    if (!Object.keys(parsed ?? {}).length) {
      res.status(400).send({ error: "Invalid" });
      return;
    }
    const data: Entity & { id: string } = {
      id: entityID,
      ...parsed,
    };
    const { connection, collection } = await Users();
    const result = await collection.updateOne(
      { $or: [{ userID }, { slug: userID }] },
      {
        $set: {
          "entities.$[entity].data.$[position]": data,
        },
      },
      {
        arrayFilters: [
          { "entity.name": entityName },
          { "position.id": entityID },
        ],
      }
    );
    if (result.modifiedCount > 0) {
      return res.send({ message: "Success", data });
    }
    res.status(400).send({ error: "Invalid" });
  }),
  DELETE: catchErrors(async (req, res) => {
    const { userID, entityID } = req.query;
    const { connection, collection } = await Users();
    const result = await collection.updateOne(
      { $or: [{ userID }, { slug: userID }] },
      {
        $pull: {
          "entities.$[].data": { id: entityID },
        },
      }
    );
    if (result.modifiedCount > 0) {
      return res.send({ message: "Success", result });
    }
    res.status(400).send({ error: "Invalid" });
  }),
});
