import joi from "joi";

import { cookies } from "next/headers";

import { usersRepo } from "_helpers/server";
import { apiHandler } from "_helpers/server/api";

module.exports = apiHandler({
  GET: getById,
  PUT: update,
  DELETE: _delete,
});

async function getById(req: Request, { params: { id } }: any) {
  return await usersRepo.getById(id);
}

async function update(req: Request, { params: { id } }: any) {
  const body = await req.json();
  await usersRepo.update(id, body);
}

update.schema = joi.object({
  firstName: joi.string(),
  lastName: joi.string(),
  username: joi.string(),
  password: joi.string().min(6).allow(""),
  role: joi.string(),
});

async function _delete(req: Request, { params: { id } }: any) {
  await usersRepo.delete(id);

  // logout automático se o usuário se deletar
  if (id === req.headers.get("userId")) {
    cookies().delete("authorization");
    return { deletedSelf: true };
  }
}
