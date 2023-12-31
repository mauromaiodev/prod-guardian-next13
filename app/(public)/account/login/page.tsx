"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import { useUserService } from "_services";

export default Login;

function Login() {
  const userService = useUserService();

  // pega as functions para buildar o form com o hook useForm
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const fields = {
    username: register("username", {
      required: "Nome de usuário é obrigatório",
    }),
    password: register("password", { required: "Senha é obrigatória" }),
  };

  async function onSubmit({ username, password }: any) {
    await userService.login(username, password);
  }

  return (
    <div className="card">
      <h4 className="card-header">Login</h4>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Usuário</label>
            <input
              {...fields.username}
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">
              {errors.username?.message?.toString()}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              {...fields.password}
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">
              {errors.password?.message?.toString()}
            </div>
          </div>
          <button disabled={formState.isSubmitting} className="btn btn-primary">
            {formState.isSubmitting && (
              <span className="spinner-border spinner-border-sm me-1"></span>
            )}
            Login
          </button>
          <Link href="/account/register" className="btn btn-link">
            Crie uma conta
          </Link>
        </form>
      </div>
    </div>
  );
}
