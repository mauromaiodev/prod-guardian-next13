import { cookies } from "next/headers";
import joi from "joi";

import { usersRepo } from "_helpers/server";
import { apiHandler } from "_helpers/server/api";

module.exports = apiHandler({
  POST: login,
});

async function login(req: Request) {
  const body = await req.json();
  const { user, token } = await usersRepo.authenticate(body);

  // retorna um token jwt no cookie http
  cookies().set("authorization", token, { httpOnly: true });

  return user;
}

login.schema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});
