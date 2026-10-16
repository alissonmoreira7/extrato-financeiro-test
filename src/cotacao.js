const URL_API = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';

const apiReal = {
  async cotacaoDolar() {
    const resposta = await fetch(URL_API);
   
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
    
    const json = await resposta.json();
    
    return Number(json.USDBRL.bid);
  },
};

function criarConversor(api = apiReal, validadeMs = 60_000) {
  let cache = null;

  async function obterCotacao() {
    const agora = Date.now();
    if (cache && agora - cache.horario < validadeMs) return cache.valor;

    const valor = await api.cotacaoDolar();
    if (typeof valor !== 'number' || valor <= 0) {
      throw new Error('Cotação inválida recebida da API');
    }
    cache = { valor, horario: agora };
    return valor;
  }

  async function paraDolar(valorEmReais) {
    const cotacao = await obterCotacao();
    return Math.round((valorEmReais / cotacao) * 100) / 100;
  }

  return { paraDolar, obterCotacao };
}

module.exports = { criarConversor, apiReal };
