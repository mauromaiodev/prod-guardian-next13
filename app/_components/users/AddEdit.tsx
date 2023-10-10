"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { useAlertService, useUserService } from "_services";

export { AddEdit };

function AddEdit({ title, user }: { title: string; user?: any }) {
  const router = useRouter();
  const alertService = useAlertService();
  const userService = useUserService();

  // pega as functions para buildar o form com o hook useForm
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: user,
  });
  const { errors } = formState;

  const fields = {
    firstName: register("firstName", { required: "First Name is required" }),
    lastName: register("lastName", { required: "Last Name is required" }),
    username: register("username", { required: "Username is required" }),
    password: register("password", {
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
      // senha só só é obrigatória no modo adicionar
      validate: (value) =>
        !user && !value ? "Password is required" : undefined,
    }),
  };

  async function onSubmit(data: any) {
    alertService.clear();
    try {
      // criar ou editar usuário baseado em user prop
      let message;
      if (user) {
        await userService.update(user.id, data);
        message = "Usuário atualizado";
      } else {
        await userService.create(data);
        message = "Usuário criado";
      }

      // redirecionar para a lista de usuários com mensagem de sucesso
      router.push("/users");
      alertService.success(message, true);
    } catch (error: any) {
      alertService.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{title}</h1>
      <div className="row">
        <div className="mb-3 col">
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
        <div className="mb-3 col">
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
      </div>
      <div className="row">
        <div className="mb-3 col">
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
        <div className="mb-3 col">
          <label className="form-label">
            Senha
            {user && (
              <em className="ms-1">
                (Deixe vazio para continuar com a mesma senha)
              </em>
            )}
          </label>
          <input
            {...fields.password}
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">
            {errors.password?.message?.toString()}
          </div>
        </div>
      </div>
      <div className="mb-3">
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="btn btn-primary me-2"
        >
          {formState.isSubmitting && (
            <span className="spinner-border spinner-border-sm me-1"></span>
          )}
          Salvar
        </button>
        <button
          onClick={() => reset()}
          type="button"
          disabled={formState.isSubmitting}
          className="btn btn-secondary"
        >
          Resetar Alterações
        </button>
        <Link href="/users" className="btn btn-link">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
