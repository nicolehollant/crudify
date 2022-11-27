import { Users } from "@server/db";
import {
  catchErrors,
  createValidatorFromJson,
  ErrorResponse,
  getEmailByIdentifier,
  nanoid,
  parseNStringify,
  requireAuthAsEmail,
  toMethods,
} from "@server/utils";
import { z } from "zod";

export default toMethods({
  // POST /user/:userID/entity
  POST: catchErrors(async (req, res) => {
    const { userID } = req.query;
    const { schema, name } = parseNStringify(req.body);
    if (!userID || !name || !schema) {
      res.status(400).send({
        error: "Missing params",
        userID,
        name,
        schema,
      });
      return;
    }
    // only allow adding entities in your own account
    const userFromPathParam = await getEmailByIdentifier(String(userID));
    await requireAuthAsEmail(req, userFromPathParam);
    // get validator
    const validator = createValidatorFromJson(schema);
    if (!z.object(validator)) {
      throw new Error("invalid");
    }
    const entity = {
      data: [],
      name: name,
      validator: schema,
    };
    const { connection, collection } = await Users();
    const [existing] = await collection
      .find({ $or: [{ userID }, { slug: userID }] })
      .project({ entities: { $elemMatch: { name: entity.name } }, _id: 0 })
      .toArray();
    if (Object.keys(existing ?? {}).length) {
      res.status(400).send({ error: "Entity already exists", data: existing });
      return;
    }
    const updated = await collection.updateOne(
      { $or: [{ userID }, { slug: userID }] },
      {
        $push: {
          entities: entity,
        },
      }
    );
    res.send(updated as any);
  }),
});
