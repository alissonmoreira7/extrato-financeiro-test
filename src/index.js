const fs = require('fs');
const path = require('path');
const { gerarRelatorio } = require('./relatorio');
const { criarConversor } = require('./cotacao');

const LIMITES = { Alimentação: 600, Transporte: 250, Lazer: 70 };
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

async function main() {
  const arquivo = process.argv[2] || path.join(__dirname, '..', 'dados', 'extrato.csv');
  const relatorio = gerarRelatorio(fs.readFileSync(arquivo, 'utf8'), LIMITES);

  console.log('\n RELATÓRIO DO EXTRATO');
  console.log('─'.repeat(40));
  console.log(`Transações: ${relatorio.totalTransacoes} (duplicatas removidas: ${relatorio.duplicatasRemovidas})`);
  console.log(`Saldo do período: ${brl(relatorio.saldo)}`);

  console.log('\nGastos por categoria:');
  for (const [cat, valor] of Object.entries(relatorio.gastosPorCategoria)) {
    console.log(`  ${cat.padEnd(14)} ${brl(valor)}`);
  }

  console.log(`\nMaiores gastos: ${relatorio.maioresGastos.join(', ')}`);

  if (relatorio.alertas.length) {
    console.log('\nAlertas de orçamento:');
    relatorio.alertas.forEach((a) => console.log(`  ${a.nivel}: ${a.categoria} (${a.percentual}% do limite)`));
  }

  try {
    const usd = await criarConversor().paraDolar(relatorio.saldo);
    console.log(`\nSaldo em dólar: US$ ${usd.toFixed(2)}`);
  } catch {
    console.log('\n(Sem internet: conversão para dólar indisponível)');
  }
}

main();