const { criarConversor, apiReal } = require('../src/cotacao');

describe('Conversão para dólar (MOCKS + ASYNC)', () => {
  let apiFalsa;

  beforeEach(() => {
    apiFalsa = { cotacaoDolar: jest.fn().mockResolvedValue(5.0) };
  });

  test('converte reais para dólar usando a cotação da API', async () => {
    const conversor = criarConversor(apiFalsa);
    
    await expect(conversor.paraDolar(100)).resolves.toBe(20);
    
    expect(apiFalsa.cotacaoDolar).toHaveBeenCalledTimes(1);
  });

  test('usa CACHE: não chama a API de novo dentro do tempo de validade', async () => {
    const conversor = criarConversor(apiFalsa);
    
    await conversor.paraDolar(100);
    
    await conversor.paraDolar(200);
    
    await conversor.paraDolar(300);
    
    expect(apiFalsa.cotacaoDolar).toHaveBeenCalledTimes(1); 
  });

  test('busca nova cotação quando o cache expira (FAKE TIMERS)', async () => {
    jest.useFakeTimers({ now: new Date('2026-10-16T08:00:00Z') });
    
    apiFalsa.cotacaoDolar.mockResolvedValueOnce(5.0).mockResolvedValueOnce(4.0);
    
    const conversor = criarConversor(apiFalsa, 60_000);

    await expect(conversor.paraDolar(100)).resolves.toBe(20);
    
    jest.advanceTimersByTime(61_000); 
    
    await expect(conversor.paraDolar(100)).resolves.toBe(25);

    expect(apiFalsa.cotacaoDolar).toHaveBeenCalledTimes(2);
    
    jest.useRealTimers();
  });

  test('propaga o erro quando a API está fora do ar', async () => {
    apiFalsa.cotacaoDolar.mockRejectedValue(new Error('Servidor fora do ar'));
    await expect(criarConversor(apiFalsa).paraDolar(100)).rejects.toThrow('Servidor fora do ar');
  });

  test.each([0, -5, 'abc', null])('rejeita cotação inválida da API: %p', async (valor) => {
    apiFalsa.cotacaoDolar.mockResolvedValue(valor);
    await expect(criarConversor(apiFalsa).paraDolar(100)).rejects.toThrow('Cotação inválida');
  });
});

describe('API real (com fetch mockado com jest.spyOn)', () => {
  afterEach(() => jest.restoreAllMocks());

  test('lê o campo "bid" da resposta da AwesomeAPI', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ USDBRL: { bid: '5.4321' } }),
    });

    await expect(apiReal.cotacaoDolar()).resolves.toBe(5.4321);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('USD-BRL'));
  });

  test('o conversor usa a API real por padrão', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ USDBRL: { bid: '5' } }),
    });
    await expect(criarConversor().paraDolar(50)).resolves.toBe(10);
  });

  test('lança erro quando a resposta HTTP não é OK', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 503 });
    await expect(apiReal.cotacaoDolar()).rejects.toThrow('Erro HTTP 503');
  });
});
