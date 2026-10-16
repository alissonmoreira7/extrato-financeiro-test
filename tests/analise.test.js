const {
  removerDuplicatas,
  calcularSaldo,
  gastosPorCategoria,
  maioresGastos,
  verificarOrcamento,
} = require('../src/analise');

describe('Análise das transações', () => {
  let transacoes;

  beforeEach(() => {
    transacoes = [
      { data: '2026-10-01', descricao: 'SALARIO', valor: 1800, categoria: 'Renda' },
      { data: '2026-10-02', descricao: 'IFOOD', valor: -45.9, categoria: 'Alimentação' },
      { data: '2026-10-02', descricao: 'IFOOD', valor: -45.9, categoria: 'Alimentação' },
      { data: '2026-10-03', descricao: 'MERCADO', valor: -300, categoria: 'Alimentação' },
      { data: '2026-10-04', descricao: 'UBER', valor: -0.1, categoria: 'Transporte' },
      { data: '2026-10-05', descricao: 'UBER', valor: -0.2, categoria: 'Transporte' },
    ];
  });

  test('remove transações duplicadas', () => {
    const unicas = removerDuplicatas(transacoes);
    expect(unicas).toHaveLength(5);
  });

  test('calcula o saldo sem erro de ponto flutuante', () => {
    expect(calcularSaldo(transacoes)).toBe(1407.9);
  });

  test('soma os gastos por categoria (só valores negativos)', () => {
    expect(gastosPorCategoria(transacoes)).toEqual({
      Alimentação: 391.8,
      Transporte: 0.3,
    });
  });

  test('retorna os maiores gastos em ordem', () => {
    const top = maioresGastos(transacoes, 2).map((t) => t.descricao);
    expect(top).toEqual(['MERCADO', 'IFOOD']);
  });

  test('lista vazia não quebra nada', () => {
    expect(calcularSaldo([])).toBe(0);
    expect(gastosPorCategoria([])).toEqual({});
    expect(maioresGastos([])).toEqual([]);
  });
});

describe('verificarOrcamento', () => {
  test.each([
    [500, 79, []], 
    [500, 80, [{ categoria: 'Lazer', nivel: 'ATENÇÃO', percentual: 80 }]], // na borda
    [500, 100, [{ categoria: 'Lazer', nivel: 'ATENÇÃO', percentual: 100 }]],
    [500, 101, [{ categoria: 'Lazer', nivel: 'ESTOURADO', percentual: 101 }]],
  ])('limite %d, gasto de %d%% → %j', (limite, percentual, esperado) => {
    const gastos = { Lazer: (limite * percentual) / 100 };
    expect(verificarOrcamento(gastos, { Lazer: limite })).toEqual(esperado);
  });

  test('categoria sem gastos não gera alerta', () => {
    expect(verificarOrcamento({}, { Saúde: 200 })).toEqual([]);
  });
});
