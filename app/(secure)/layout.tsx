import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Alert, Nav } from "_components";
import { auth } from "_helpers/server";

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
  // se não estiver logado, redirecionar para a página de login
  if (!auth.isAuthenticated()) {
    const returnUrl = encodeURIComponent(headers().get("x-invoke-path") || "/");
    redirect(`/account/login?returnUrl=${returnUrl}`);
  }

  return (
    <div className="app-container bg-light">
      <Nav />
      <Alert />
      <div className="p-4">
        <div className="container">{children}</div>
      </div>
      <div className="text-center bg-dark p-2">
        <p>
          <a href="https://mauromaio.vercel.app/" target="_blank">
            Mauro Maio Dev - Projetos
          </a>
        </p>
      </div>
    </div>
  );
}
