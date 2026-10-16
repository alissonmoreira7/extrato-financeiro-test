const { categorizar, categorizarTodas } = require('../src/categorizador');

describe('categorizar', () => {
  test.each([
    ['IFOOD *PEDIDO', 'Alimentação'],
    ['UBER *TRIP', 'Transporte'],
    ['NETFLIX.COM', 'Lazer'],
    ['UDEMY CURSO JEST', 'Educação'],
    ['FARMÁCIA PAGUE MENOS', 'Saúde'],
    ['SALARIO ESTAGIO', 'Renda'],
    ['LOJA DESCONHECIDA', 'Outros'],
  ])('"%s" → %s', (descricao, categoria) => {
    expect(categorizar(descricao)).toBe(categoria);
  });

  test('não diferencia maiúsculas de minúsculas', () => {
    expect(categorizar('uber eats')).toBe('Transporte');
  });

  test('aceita regras personalizadas', () => {
    const regras = [{ categoria: 'Pets', palavras: ['PETZ'] }];
    expect(categorizar('PETZ SALVADOR', regras)).toBe('Pets');
  });
});

describe('categorizarTodas', () => {
  test('adiciona a categoria sem modificar o array original', () => {
    const originais = [{ descricao: 'SPOTIFY', valor: -21.9 }];
    const resultado = categorizarTodas(originais);

    expect(resultado[0]).toMatchObject({ descricao: 'SPOTIFY', categoria: 'Lazer' });
    expect(originais[0]).not.toHaveProperty('categoria');
  });
});
