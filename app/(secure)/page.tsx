"use client";

import { useEffect } from "react";

import { Spinner } from "_components";
import { useUserService } from "_services";

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
      </>
    );
  } else {
    return <Spinner />;
  }
}
