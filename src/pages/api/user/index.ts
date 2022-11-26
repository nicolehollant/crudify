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
    const session = await requireAuth(req);
    const { connection, collection } = await Users();
    const [existing] = await collection
      .find({
        $or: [
          { email: session.user.email },
          { slug: session.user.email },
          { userID: session.user.email },
        ],
      })
      .project({ email: 1, slug: 1, userID: 1, name: 1 })
      .toArray();
    if (!existing?.userID) {
      throw new CrudifyError("User does not have account", 400);
    }
    return res.status(200).json(existing);
  }),
  POST: catchErrors(async (req, res) => {
    const session = await requireAuth(req);
    const email = session.user.email;
    const { name, slug } = JSON.parse(req.body);
    if (!email || !name || !slug) {
      res.status(400).send(ErrorResponse("Missing params"));
      return;
    }
    const { connection, collection } = await Users();
    const [existing] = await collection
      .find({ $or: [{ email }, { slug }] })
      .toArray();
    if (Object.keys(existing ?? {}).length) {
      res.status(400).send(ErrorResponse("User already exists"));
      return;
    }
    const doc = await collection.insertOne({
      email,
      name,
      slug,
      userID: nanoid(),
      entities: [],
    });
    return res.status(200).json(doc as any);
  }),
});
