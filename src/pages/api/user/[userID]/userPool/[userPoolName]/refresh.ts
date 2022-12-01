import {
  generateAccessToken,
  generateRefreshToken,
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

/** 

  /user/:userID/userPool/:userPoolName/refresh

*/
export default toMethods({
  POST: catchErrors(async (req, res) => {
    const auth = req.headers.authorization;
    const { refreshToken } = parseNStringify(req.body);
    if ((!refreshToken && !auth) || !process.env.JWT_SECRET) {
      return res.status(401).send("no auth header");
    }
    if (refreshToken) {
      const token = refreshToken.replace("Bearer", "").trim();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded?.hasOwnProperty("email")) {
        return res.status(403).send({ message: "invalid token" });
      }
      const { email } = decoded as {
        email: string;
      };
      const accessToken = generateAccessToken(email);
      return res.send({ accessToken, refreshToken });
    } else {
      const token = auth!.replace("Bearer", "").trim();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (
        !decoded?.hasOwnProperty("email") ||
        !decoded?.hasOwnProperty("expiration")
      ) {
        return res.status(403).send({ message: "invalid token" });
      }
      const { email, expiration } = decoded as {
        email: string;
        expiration: Date;
      };
      if (expiration < new Date()) {
        return res.status(403).send("token expired");
      }
      const accessToken = generateAccessToken(email);
      const newRefreshToken = generateRefreshToken(email);
      return res.send({ accessToken, refreshToken: newRefreshToken });
    }
  }),
});
