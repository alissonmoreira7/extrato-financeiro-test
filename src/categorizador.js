
const REGRAS = [
  { categoria: 'Alimentação', palavras: ['IFOOD', 'RESTAURANTE', 'PADARIA', 'MERCADO', 'ATACADAO'] },
  { categoria: 'Transporte', palavras: ['UBER', '99APP', 'POSTO', 'COMBUSTIVEL', 'METRO'] },
  { categoria: 'Lazer', palavras: ['NETFLIX', 'SPOTIFY', 'CINEMA', 'STEAM'] },
  { categoria: 'Educação', palavras: ['FACULDADE', 'UDEMY', 'LIVRARIA', 'ALURA'] },
  { categoria: 'Saúde', palavras: ['FARMACIA', 'DROGARIA', 'CLINICA', 'ACADEMIA'] },
  { categoria: 'Renda', palavras: ['SALARIO', 'PIX RECEBIDO', 'ESTAGIO', 'BOLSA'] },
];

function semAcentos(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function categorizar(descricao, regras = REGRAS) {
  const texto = semAcentos(String(descricao).toUpperCase());
  const regra = regras.find((r) => r.palavras.some((p) => texto.includes(p)));
  return regra ? regra.categoria : 'Outros';
}

function categorizarTodas(transacoes, regras = REGRAS) {
  return transacoes.map((t) => ({ ...t, categoria: categorizar(t.descricao, regras) }));
}

module.exports = { REGRAS, categorizar, categorizarTodas, semAcentos };