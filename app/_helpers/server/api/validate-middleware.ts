import joi from "joi";

export { validateMiddleware };

async function validateMiddleware(req: Request, schema: joi.ObjectSchema) {
  if (!schema) return;

  const options = {
    abortEarly: false, // inclui todos os erros
    allowUnknown: true, // ignorar props desconhecidas
    stripUnknown: true, // remover props desconhecidas
  };

  const body = await req.json();
  const { error, value } = schema.validate(body, options);

  if (error) {
    throw `Validation error: ${error.details.map((x) => x.message).join(", ")}`;
  }

  // atualizar o req.json para retornar o req body limpo
  req.json = () => value;
}
