"use client";

import { useEffect, useState } from "react";
import { getLivros, criarLivro, deletarLivro, Livro } from "@/lib/api";

const formVazio = { titulo: "", autor: "", isbn: "", genero: "", anoPublicacao: "", quantidadeTotal: "" };

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");

  async function carregar() {
    setLivros(await getLivros());
  }

  useEffect(() => { carregar(); }, []);

  async function salvar() {
    setErro("");
    if (!form.titulo || !form.autor) { setErro("Título e autor são obrigatórios."); return; }
    await criarLivro({
      titulo: form.titulo,
      autor: form.autor,
      isbn: form.isbn,
      genero: form.genero,
      anoPublicacao: Number(form.anoPublicacao),
      quantidadeTotal: Number(form.quantidadeTotal),
    });
    setModal(false);
    setForm(formVazio);
    carregar();
  }

  async function deletar(id: number) {
    if (!confirm("Remover este livro?")) return;
    await deletarLivro(id);
    carregar();
  }

  const filtrados = livros.filter(
    (l) =>
      l.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      l.autor.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Livros</h1>
        <button onClick={() => setModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          + Novo Livro
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por título ou autor..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-full mb-4 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Autor</th>
              <th className="px-4 py-3">Gênero</th>
              <th className="px-4 py-3">Ano</th>
              <th className="px-4 py-3 text-center">Total</th>
              <th className="px-4 py-3 text-center">Disponíveis</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhum livro encontrado.</td></tr>
            )}
            {filtrados.map((livro) => (
              <tr key={livro.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{livro.titulo}</td>
                <td className="px-4 py-3 text-gray-600">{livro.autor}</td>
                <td className="px-4 py-3 text-gray-600">{livro.genero}</td>
                <td className="px-4 py-3 text-gray-600">{livro.anoPublicacao}</td>
                <td className="px-4 py-3 text-center">{livro.quantidadeTotal}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${livro.quantidadeDisponivel > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {livro.quantidadeDisponivel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => deletar(livro.id)} className="text-red-500 hover:text-red-700 text-xs">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Novo Livro</h2>
            {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}
            <div className="flex flex-col gap-3">
              {[
                { label: "Título *", key: "titulo" },
                { label: "Autor *", key: "autor" },
                { label: "ISBN", key: "isbn" },
                { label: "Gênero", key: "genero" },
                { label: "Ano de Publicação", key: "anoPublicacao" },
                { label: "Quantidade de Exemplares", key: "quantidadeTotal" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input
                    type="text"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => { setModal(false); setErro(""); setForm(formVazio); }} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">Cancelar</button>
              <button onClick={salvar} className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}