"use client";

import { useEffect, useState } from "react";
import {
  getEmprestimos, realizarEmprestimo, devolverEmprestimo,
  getLivros, getUsuarios,
  Emprestimo, Livro, Usuario,
} from "@/lib/api";

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modal, setModal] = useState(false);
  const [usuarioId, setUsuarioId] = useState("");
  const [livroId, setLivroId] = useState("");
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "devolvidos">("todos");

  async function carregar() {
    const [e, l, u] = await Promise.all([getEmprestimos(), getLivros(), getUsuarios()]);
    setEmprestimos(e);
    setLivros(l);
    setUsuarios(u);
  }

  useEffect(() => { carregar(); }, []);

  async function salvar() {
    setErro("");
    if (!usuarioId || !livroId) { setErro("Selecione um usuário e um livro."); return; }
    const resultado = await realizarEmprestimo(Number(usuarioId), Number(livroId));
    if ("mensagem" in resultado) { setErro(resultado.mensagem); return; }
    setModal(false);
    setUsuarioId("");
    setLivroId("");
    carregar();
  }

  async function devolver(id: number) {
    if (!confirm("Confirmar devolução?")) return;
    await devolverEmprestimo(id);
    carregar();
  }

  const filtrados = emprestimos.filter((e) => {
    if (filtro === "ativos") return e.ativo;
    if (filtro === "devolvidos") return !e.ativo;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Empréstimos</h1>
        <button onClick={() => setModal(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium">
          + Novo Empréstimo
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(["todos", "ativos", "devolvidos"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${filtro === f ? "bg-orange-500 text-white" : "bg-white border hover:bg-gray-50"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Livro</th>
              <th className="px-4 py-3">Empréstimo</th>
              <th className="px-4 py-3">Previsão</th>
              <th className="px-4 py-3">Devolução</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhum empréstimo encontrado.</td></tr>
            )}
            {filtrados.map((e) => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{e.usuario.nome}</td>
                <td className="px-4 py-3 text-gray-600">{e.livro.titulo}</td>
                <td className="px-4 py-3 text-gray-600">{e.dataEmprestimo}</td>
                <td className="px-4 py-3 text-gray-600">{e.dataPrevistaDevolucao}</td>
                <td className="px-4 py-3 text-gray-600">{e.dataDevolvido ?? "—"}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${e.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {e.ativo ? "Ativo" : "Devolvido"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {e.ativo && (
                    <button onClick={() => devolver(e.id)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      Devolver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Novo Empréstimo</h2>
            {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Usuário *</label>
                <select
                  value={usuarioId}
                  onChange={(e) => setUsuarioId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Selecione um usuário</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>{u.nome} — {u.matricula}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Livro *</label>
                <select
                  value={livroId}
                  onChange={(e) => setLivroId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Selecione um livro</option>
                  {livros.map((l) => (
                    <option key={l.id} value={l.id} disabled={l.quantidadeDisponivel === 0}>
                      {l.titulo} — {l.quantidadeDisponivel} disponível(is)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => { setModal(false); setErro(""); }} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">Cancelar</button>
              <button onClick={salvar} className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}