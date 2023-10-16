"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import { useUserService } from "_services";

export default Register;

function Register() {
  const userService = useUserService();

  // pega as functions para buildar o form com o hook useForm
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const fields = {
    firstName: register("firstName", { required: "Nome é obrigatório" }),
    lastName: register("lastName", { required: "Sobrenome é obrigatório" }),
    username: register("username", {
      required: "Nome de usuário é obrigatório",
    }),
    password: register("password", {
      required: "Senha é obrigatória",
      minLength: {
        value: 6,
        message: "Senha deve conter no mínimo 6 caracteres",
      },
    }),
  };

  async function onSubmit(user: any) {
    await userService.register(user);
  }

  return (
    <div className="card">
      <h4 className="card-header">Cadastro</h4>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              {...fields.firstName}
              type="text"
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">
              {errors.firstName?.message?.toString()}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Sobrenome</label>
            <input
              {...fields.lastName}
              type="text"
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">
              {errors.lastName?.message?.toString()}
            </div>
          </div>
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
            Criar conta
          </button>
          <Link href="/account/login" className="btn btn-link">
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
}
