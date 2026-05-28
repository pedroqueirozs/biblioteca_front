"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/livros", label: "Livros" },
  { href: "/usuarios", label: "Usuários" },
  { href: "/emprestimos", label: "Empréstimos" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-8">
        <span className="font-bold text-lg tracking-wide">Biblioteca Digital</span>
        <div className="flex gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-white text-blue-900"
                  : "hover:bg-blue-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}