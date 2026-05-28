"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLivros, getUsuarios, getEmprestimos } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ livros: 0, usuarios: 0, ativos: 0, disponiveis: 0 });

  useEffect(() => {
    async function carregar() {
      const [livros, usuarios, emprestimos] = await Promise.all([
        getLivros(),
        getUsuarios(),
        getEmprestimos(),
      ]);
      setStats({
        livros: livros.length,
        usuarios: usuarios.length,
        ativos: emprestimos.filter((e) => e.ativo).length,
        disponiveis: livros.reduce((acc, l) => acc + l.quantidadeDisponivel, 0),
      });
    }
    carregar();
  }, []);

  const cards = [
    { label: "Total de Livros", value: stats.livros, href: "/livros", color: "bg-blue-600" },
    { label: "Exemplares Disponíveis", value: stats.disponiveis, href: "/livros", color: "bg-green-600" },
    { label: "Usuários Cadastrados", value: stats.usuarios, href: "/usuarios", color: "bg-purple-600" },
    { label: "Empréstimos Ativos", value: stats.ativos, href: "/emprestimos", color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className={`${card.color} text-white rounded-xl p-5 shadow hover:opacity-90 transition cursor-pointer`}>
              <p className="text-sm opacity-80">{card.label}</p>
              <p className="text-4xl font-bold mt-1">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { href: "/livros", icon: "📖", title: "Gerenciar Livros", desc: "Cadastre e consulte o acervo" },
          { href: "/usuarios", icon: "👤", title: "Gerenciar Usuários", desc: "Cadastre os usuários da biblioteca" },
          { href: "/emprestimos", icon: "🔄", title: "Empréstimos", desc: "Realize e gerencie devoluções" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="bg-white rounded-xl p-6 shadow border hover:shadow-md transition cursor-pointer">
              <span className="text-3xl">{item.icon}</span>
              <h2 className="font-semibold text-lg mt-2">{item.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
