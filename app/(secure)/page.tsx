"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useUserService } from "_services";
import { Spinner } from "_components";

export default Home;

function Home() {
  const userService = useUserService();
  const user = userService.currentUser;

  useEffect(() => {
    userService.getCurrent();
  }, []);

  if (user) {
    return (
      <>
        <h1>Eai {user.firstName}!</h1>
        <p>
          Bem vindo(a) ao ProdGuardian, seu sistema para gerenciamento de
          produtos e fornecedores :D
        </p>
        <p>
          <Link href="/users">Gerenciar Fornecedores</Link>
        </p>
      </>
    );
  } else {
    return <Spinner />;
  }
}
