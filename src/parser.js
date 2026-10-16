function converterValor(texto){
    if (typeof texto === 'number') return texto;

    if (typeof texto !== 'string' || texto.trim() === ''){
        throw new Error(`Valor inválido: "${texto}"`);
    }

    let limpo = texto.replace(/R\$\s?/i, '').replace(/\s/g, '');

    if (limpo.includes(',')) {
        limpo = limpo.replace(/\./g, '').replace(',', '.');
    }
    
    const numero = Number(limpo);
    if (limpo === '' || Number.isNaN(numero)) throw new Error(`Valor inválido: "${texto}"`);
    return Math.round(numero * 100) / 100;
}

function converterData(texto) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(texto).trim());
  if (!match) throw new Error(`Data inválida: "${texto}"`);

  const [, dia, mes, ano] = match;
  const data = new Date(`${ano}-${mes}-${dia}T00:00:00Z`);

  if (Number.isNaN(data.getTime()) || data.getUTCDate() !== Number(dia)) {
    throw new Error(`Data inválida: "${texto}"`);
  }
  return `${ano}-${mes}-${dia}`;
}

function limparDescricao(texto) {
  return String(texto).trim().replace(/\s+/g, ' ').toUpperCase();
}

function lerExtrato(conteudoCsv) {
  const linhas = conteudoCsv.split(/\r?\n/);
  const transacoes = [];

  linhas.forEach((linha, indice) => {
    if (linha.trim() === '') return;
    if (indice === 0 && /data/i.test(linha)) return; 

    const colunas = linha.split(';');
    if (colunas.length !== 3) {
      throw new Error(`Linha ${indice + 1} mal formatada: "${linha}"`);
    }

    const [data, descricao, valor] = colunas;
    transacoes.push({
      data: converterData(data),
      descricao: limparDescricao(descricao),
      valor: converterValor(valor),
    });
  });

  return transacoes;
}

module.exports = { converterValor, converterData, limparDescricao, lerExtrato };