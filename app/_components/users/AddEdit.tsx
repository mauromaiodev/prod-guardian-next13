"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
    firstName: register("firstName", { required: "Nome é obrigatório" }),
    lastName: register("lastName", { required: "Sobrenome é obrigatório" }),
    username: register("username", {
      required: "Nome de usuário é obrigatório",
    }),
    password: register("password", {
      minLength: {
        value: 6,
        message: "Senha deve conter no mínimo 6 caracteres",
      },
      // senha só só é obrigatória no modo adicionar
      validate: (value) =>
        !user && !value ? "Senha é obrigatória" : undefined,
    }),
    role: register("role", { required: "Cargo é obrigatório" }),
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
      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Cargo</label>
          <select
            {...fields.role}
            className={`form-select ${errors.role ? "is-invalid" : ""}`}
          >
            <option selected value="">
              Selecione um cargo
            </option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
          <div className="invalid-feedback">
            {errors.role?.message?.toString()}
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
