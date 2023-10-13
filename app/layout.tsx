import "bootstrap/dist/css/bootstrap.min.css";
import "globals.css";

export const metadata = {
  title: "Class Project",
};

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        <div className="text-center mt-4">
          <p>
            <a href="https://mauromaio.vercel.app/" target="_blank">
              Mauro Maio Dev - Projetos
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
