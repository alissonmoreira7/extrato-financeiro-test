const { lerExtrato } = require('./parser');
const { categorizarTodas } = require('./categorizador');
const analise = require('./analise');

function gerarRelatorio(conteudoCsv, limites = {}) {
  const brutas = lerExtrato(conteudoCsv);
  const unicas = analise.removerDuplicatas(brutas);
  const transacoes = categorizarTodas(unicas);
  const gastos = analise.gastosPorCategoria(transacoes);

  return {
    totalTransacoes: transacoes.length,
    duplicatasRemovidas: brutas.length - unicas.length,
    saldo: analise.calcularSaldo(transacoes),
    gastosPorCategoria: gastos,
    maioresGastos: analise.maioresGastos(transacoes).map((t) => t.descricao),
    alertas: analise.verificarOrcamento(gastos, limites),
  };
}

module.exports = { gerarRelatorio };
