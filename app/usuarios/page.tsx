"use client";

import { useEffect, useState } from "react";
import { getUsuarios, criarUsuario, deletarUsuario, Usuario } from "@/lib/api";

const formVazio = { nome: "", email: "", telefone: "", matricula: "" };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");

  async function carregar() {
    setUsuarios(await getUsuarios());
  }

  useEffect(() => { carregar(); }, []);

  async function salvar() {
    setErro("");
    if (!form.nome || !form.email) { setErro("Nome e e-mail são obrigatórios."); return; }
    await criarUsuario(form);
    setModal(false);
    setForm(formVazio);
    carregar();
  }

  async function deletar(id: number) {
    if (!confirm("Remover este usuário?")) return;
    await deletarUsuario(id);
    carregar();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <button onClick={() => setModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium">
          + Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Matrícula</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Nenhum usuário cadastrado.</td></tr>
            )}
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.nome}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-gray-600">{u.telefone}</td>
                <td className="px-4 py-3 text-gray-600">{u.matricula}</td>
                <td className="px-4 py-3">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-semibold">{u.tipoPessoa}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => deletar(u.id)} className="text-red-500 hover:text-red-700 text-xs">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Novo Usuário</h2>
            {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}
            <div className="flex flex-col gap-3">
              {[
                { label: "Nome *", key: "nome" },
                { label: "E-mail *", key: "email" },
                { label: "Telefone", key: "telefone" },
                { label: "Matrícula", key: "matricula" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input
                    type="text"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => { setModal(false); setErro(""); setForm(formVazio); }} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">Cancelar</button>
              <button onClick={salvar} className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}