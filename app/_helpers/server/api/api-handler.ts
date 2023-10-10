import { NextRequest, NextResponse } from "next/server";

import { errorHandler, jwtMiddleware, validateMiddleware } from "./";

export { apiHandler };

function apiHandler(handler: any) {
  const wrappedHandler: any = {};
  const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  // encapsular os métodos do handler para adicionar o middleware e o global error handler
  httpMethods.forEach((method) => {
    if (typeof handler[method] !== "function") return;

    wrappedHandler[method] = async (req: NextRequest, ...args: any) => {
      try {
        // patch o req.son porque ele só pode ser chamado uma vez
        const json = await req.json();
        req.json = () => json;
      } catch {}

      try {
        // global middleware
        await jwtMiddleware(req);
        await validateMiddleware(req, handler[method].schema);

        // route handler
        const responseBody = await handler[method](req, ...args);
        return NextResponse.json(responseBody || {});
      } catch (err: any) {
        // global error handler
        return errorHandler(err);
      }
    };
  });

  return wrappedHandler;
}
