"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner } from "_components";
import { useUserService } from "_services";

export default Users;

function Users() {
  const userService = useUserService();
  const users = userService.users;

  useEffect(() => {
    userService.getAll();
  }, []);

  return (
    <>
      <h1>Usuários</h1>
      <Link href="/users/add" className="btn btn-sm btn-success mb-2">
        Adicionar Usuário
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Nome</th>
            <th style={{ width: "20%" }}>Sobrenome</th>
            <th style={{ width: "20%" }}>Nome de usuário</th>
            <th style={{ width: "20%" }}>Cargo</th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody>
          <TableBody />
        </tbody>
      </table>
    </>
  );

  function TableBody() {
    if (users?.length) {
      return users.map((user) => (
        <tr key={user.id}>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.username}</td>
          <td>{user.role}</td>
          <td style={{ whiteSpace: "nowrap" }}>
            <Link
              href={`/users/edit/${user.id}`}
              className="btn btn-sm btn-primary me-1"
            >
              Editar
            </Link>
            <button
              onClick={() => userService.delete(user.id)}
              className="btn btn-sm btn-danger btn-delete-user"
              style={{ width: "60px" }}
              disabled={user.isDeleting}
            >
              {user.isDeleting ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <span>Deletar</span>
              )}
            </button>
          </td>
        </tr>
      ));
    }

    if (!users) {
      return (
        <tr>
          <td colSpan={4}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (users?.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="text-center">
            <div className="p-2">Não há usuários</div>
          </td>
        </tr>
      );
    }
  }
}
