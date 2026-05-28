const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// --- Tipos (espelham as entidades Java) ---

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  isbn: string;
  genero: string;
  anoPublicacao: number;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  matricula: string;
  tipoPessoa: string;
}

export interface Emprestimo {
  id: number;
  usuario: Usuario;
  livro: Livro;
  dataEmprestimo: string;
  dataPrevistaDevolucao: string;
  dataDevolvido: string | null;
  ativo: boolean;
}

// --- Livros ---

export async function getLivros(): Promise<Livro[]> {
  const res = await fetch(`${API_URL}/api/livros`);
  return res.json();
}

export async function criarLivro(livro: Omit<Livro, "id" | "quantidadeDisponivel">): Promise<Livro> {
  const res = await fetch(`${API_URL}/api/livros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(livro),
  });
  return res.json();
}

export async function deletarLivro(id: number): Promise<void> {
  await fetch(`${API_URL}/api/livros/${id}`, { method: "DELETE" });
}

// --- Usuários ---

export async function getUsuarios(): Promise<Usuario[]> {
  const res = await fetch(`${API_URL}/api/usuarios`);
  return res.json();
}

export async function criarUsuario(usuario: Omit<Usuario, "id" | "tipoPessoa">): Promise<Usuario> {
  const res = await fetch(`${API_URL}/api/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return res.json();
}

export async function deletarUsuario(id: number): Promise<void> {
  await fetch(`${API_URL}/api/usuarios/${id}`, { method: "DELETE" });
}

// --- Empréstimos ---

export async function getEmprestimos(): Promise<Emprestimo[]> {
  const res = await fetch(`${API_URL}/api/emprestimos`);
  return res.json();
}

export async function realizarEmprestimo(usuarioId: number, livroId: number): Promise<Emprestimo | { mensagem: string }> {
  const res = await fetch(`${API_URL}/api/emprestimos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId, livroId }),
  });
  return res.json();
}

export async function devolverEmprestimo(id: number): Promise<Emprestimo> {
  const res = await fetch(`${API_URL}/api/emprestimos/${id}/devolver`, { method: "PUT" });
  return res.json();
}