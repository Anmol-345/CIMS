import "../globals.css";
import Navbar from "../../components/ui/custom/Navbar.jsx";

export const metadata = {
  title: "Your App",
  description: "Student Dashboard",
};

export default function RootLayout({ children }) {
  return (
      <body className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto mt-6">
          {children}
        </main>
      </body>
  );
}
