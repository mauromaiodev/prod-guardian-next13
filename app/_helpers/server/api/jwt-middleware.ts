import { NextRequest } from "next/server";

import { auth } from "_helpers/server";

export { jwtMiddleware };

async function jwtMiddleware(req: NextRequest) {
  if (isPublicPath(req)) return;

  // verificar token no request do cookie
  const id = auth.verifyToken();
  req.headers.set("userId", id);
}

function isPublicPath(req: NextRequest) {
  // rotas publicas que não precisam de autenticação
  const publicPaths = [
    "POST:/api/account/login",
    "POST:/api/account/logout",
    "POST:/api/account/register",
  ];
  return publicPaths.includes(`${req.method}:${req.nextUrl.pathname}`);
}
