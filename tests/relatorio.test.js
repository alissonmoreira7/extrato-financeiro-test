const fs = require('fs');
const path = require('path');
const { gerarRelatorio } = require('../src/relatorio');

describe('Pipeline completo (integração)', () => {
  const csv = fs.readFileSync(path.join(__dirname, '..', 'dados', 'extrato.csv'), 'utf8');
  const limites = { Alimentação: 600, Transporte: 250, Lazer: 70 };
  const relatorio = gerarRelatorio(csv, limites);

  test('remove a duplicata do iFood', () => {
    expect(relatorio.duplicatasRemovidas).toBe(1);
    expect(relatorio.totalTransacoes).toBe(13);
  });

  test('calcula o saldo do mês', () => {
    expect(relatorio.saldo).toBe(933.36);
  });

  test('alerta que o orçamento de Lazer estourou', () => {
    expect(relatorio.alertas).toContainEqual(
      expect.objectContaining({ categoria: 'Lazer', nivel: 'ESTOURADO' }),
    );
  });

  test('sem limites de orçamento, não há alertas', () => {
    expect(gerarRelatorio(csv).alertas).toEqual([]);
  });

  test('relatório completo bate com o snapshot', () => {
    expect(relatorio).toMatchSnapshot();
  });
});
