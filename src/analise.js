const arredondar = (n) => Math.round(n * 100) / 100;

function removerDuplicatas(transacoes) {
  const vistas = new Set();

  return transacoes.filter((t) => {
    const chave = `${t.data}|${t.descricao}|${t.valor}`;
   
    if (vistas.has(chave)) return false;
    vistas.add(chave);
    
    return true;
  });
}

function calcularSaldo(transacoes) {
  return arredondar(transacoes.reduce((soma, t) => soma + t.valor, 0));
}

function gastosPorCategoria(transacoes) {
  const resumo = {};
  
  for (const t of transacoes) {
    if (t.valor >= 0) continue;
    resumo[t.categoria] = arredondar((resumo[t.categoria] || 0) + Math.abs(t.valor));
  }
  
  return resumo;
}

function maioresGastos(transacoes, quantidade = 3) {
  return transacoes
    .filter((t) => t.valor < 0)
    .sort((a, b) => a.valor - b.valor)
    .slice(0, quantidade);
}

function verificarOrcamento(gastos, limites) {
  const alertas = [];
  
  for (const [categoria, limite] of Object.entries(limites)) {
    const gasto = gastos[categoria] || 0;
    
    const percentual = Math.round((gasto / limite) * 100);
    
    if (percentual > 100) alertas.push({ categoria, nivel: 'ESTOURADO', percentual });
    else if (percentual >= 80) alertas.push({ categoria, nivel: 'ATENÇÃO', percentual });
  }
  return alertas;
}

module.exports = {
  removerDuplicatas,
  calcularSaldo,
  gastosPorCategoria,
  maioresGastos,
  verificarOrcamento,
};
