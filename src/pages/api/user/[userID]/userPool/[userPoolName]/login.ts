import { generateAccessToken, transporter } from "@server/auth";
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

/** 

  /user/:userID/userPool/:userPoolName/login

*/
export default toMethods({
  POST: catchErrors(async (req, res) => {
    const { userID, userPoolName } = req.query;
    const { email } = parseNStringify(req.body);

    if (!userID || !userPoolName || !email) {
      res.status(400).send({
        error: "Missing params",
        email,
      });
      return;
    }
    const { collection } = await Users();
    const [pool] = await collection
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
            "userPools.redirectUrl": 1,
          },
        },
      ])
      .toArray();
    if (!pool) {
      throw new CrudifyError("Pool not found");
    }
    const accessToken = generateAccessToken(email);
    const mail = await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          html: signInEmail(
            pool?.userPools?.name ?? "Test Application",
            `${pool?.userPools?.redirectUrl}?token=${accessToken}`
          ),
          to: email,
          subject: "Sign In",
          from: `"${
            pool?.userPools?.name ?? "Test Application Auth"
          }" <fleur.codes.emails@gmail.com>`,
        },
        (error) => {
          console.log({ error });
          if (error) {
            resolve("error");
          }
          resolve("success");
        }
      );
    });
    console.log({ mail });
    if (mail === "success") {
      return res.status(200).json({ message: "Success" });
    }
    return res.status(500).json({ error: "Failed to send email" });
  }),
});
