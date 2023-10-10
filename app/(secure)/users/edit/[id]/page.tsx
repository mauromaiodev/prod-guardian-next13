"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AddEdit } from "_components/users";
import { Spinner } from "_components";
import { useUserService } from "_services";

export default Edit;

function Edit({ params: { id } }: any) {
  const router = useRouter();
  const userService = useUserService();
  const user = userService.user;

  useEffect(() => {
    if (!id) return;

    // fetch user para adicionar/editar a form
    userService.getById(id);
  }, [router]);

  return user ? <AddEdit title="Editar Usuário" user={user} /> : <Spinner />;
}
