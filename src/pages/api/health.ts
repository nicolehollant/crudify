import { type NextApiRequest, type NextApiResponse } from "next";

import { Users } from "@server/db";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send("Hello World");
};

export default examples;
