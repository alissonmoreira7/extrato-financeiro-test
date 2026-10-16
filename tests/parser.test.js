const { converterValor, converterData, limparDescricao, lerExtrato } = require('../src/parser')

describe('converterValor', () => {

  test.each([
    ['R$ 1.234,56', 1234],
    ['-45,90', -45.9],
    ['R$1.000.000,00', 1000000],
    ['1234.56', 1234.56],
    ['0,10', 0.1],
    [99.9, 99.9],
  ])('converte "%s" em %d', (entrada, esperado) => {
    expect(converterValor(entrada)).toBe(esperado);
  });

  test.each(['', 'abc', 'R$ ', null, undefined])('rejeita valor inválido: %p', (entrada) => {
    expect(() => converterValor(entrada)).toThrow(/Valor inválido/);
  });
});

describe('converterData', () => {
  test('converte do formato BR para ISO', () => {
    expect(converterData('15/10/2026')).toBe('2026-10-15');
  });

  test.each(['31/02/2026', '2026-10-15', '15/13/2026', 'ontem'])(
    'rejeita data inválida: %s',
    (data) => {
      expect(() => converterData(data)).toThrow('Data inválida');
    },
  );
});

describe('limparDescricao', () => {
  test('remove espaços extras e coloca em maiúsculas', () => {
    expect(limparDescricao('  uber    *trip ')).toBe('UBER *TRIP');
  });
});

describe('lerExtrato', () => {
  const csv = [
    'data;descricao;valor',
    '01/10/2026;Salario;R$ 1.800,00',
    '',
    '02/10/2026;ifood  *pedido;-45,90',
  ].join('\n');

  test('lê o CSV ignorando cabeçalho e linhas vazias', () => {
    expect(lerExtrato(csv)).toEqual([
      { data: '2026-10-01', descricao: 'SALARIO', valor: 1800 },
      { data: '2026-10-02', descricao: 'IFOOD *PEDIDO', valor: -45.9 },
    ]);
  });

  test('aceita quebra de linha do Windows (\\r\\n)', () => {
    expect(lerExtrato(csv.replace(/\n/g, '\r\n'))).toHaveLength(2);
  });

  test('informa o número da linha com erro', () => {
    const quebrado = 'data;descricao;valor\n01/10/2026;SEM VALOR';
    expect(() => lerExtrato(quebrado)).toThrow('Linha 2 mal formatada');
  });
});
