import "bootstrap/dist/css/bootstrap.min.css";
import "globals.css";

export const metadata = {
  title: "Class Project",
};

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
