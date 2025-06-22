import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-16 px-4">{children}</main>
    </div>
  );
}
