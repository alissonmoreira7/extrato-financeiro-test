# Extrato Financeiro Jest

> Pipeline de análise de extrato bancário com **56 testes automatizados** em **Jest**:
> 51 unitários e 5 de integração, com **100% de cobertura de código**.

![Testes](https://img.shields.io/badge/testes-56%20passando-brightgreen)
![Cobertura](https://img.shields.io/badge/cobertura-100%25-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933)
![Jest](https://img.shields.io/badge/jest-30-C21325)

Projeto desenvolvido para a disciplina de Testes e Qualidade de Software. Aplica na prática, com o Jest, técnicas de caixa-preta (valor limite, particionamento de equivalência e testes negativos) e de caixa-branca (cobertura de 100% de linhas e ramos), em testes unitários e de integração.

> Pipeline de análise de extrato bancário com **56 testes automatizados** em **Jest**:
> 51 unitários e 5 de integração, com **100% de cobertura de código**.

---

## Intuito do projeto

O projeto tem dois objetivos:

### 1. Resolver um problema real
Extratos bancários exportados em CSV costumam vir bagunçados:

- valores em formatos diferentes (`R$ 1.234,56`, `-45,90`, `1234.56`);
- descrições sem padrão (`UBER   *TRIP`, `ifood  *pedido`);
- transações duplicadas ao juntar extratos;
- nenhuma organização por categoria de gasto.

O programa transforma esse CSV em um relatório financeiro: saldo do período, gastos por
categoria, maiores gastos, alertas de orçamento e saldo convertido para dólar usando uma
API de câmbio real.

### 2. Demonstrar o Jest na prática
Cada parte do sistema foi pensada para exercitar um recurso diferente do Jest e uma técnica
diferente de teste de software: testes orientados a dados, mocks, código assíncrono, fake timers,
snapshot, integração e cobertura. O projeto é, ao mesmo tempo, um sistema funcional e uma vitrine
da ferramenta.

---

## Como funciona (pipeline ETL)

```
 dados/extrato.csv
        │
        ▼
 ┌──────────────┐   ┌────────────────┐   ┌─────────────┐   ┌──────────────┐
 │  1. PARSER   │──►│ 2. CATEGORIZA- │──►│ 3. ANÁLISE  │──►│ 4. RELATÓRIO │
 │  (limpeza)   │   │     DOR        │   │             │   │              │
 └──────────────┘   └────────────────┘   └─────────────┘   └──────┬───────┘
  • R$ 1.234,56       • IFOOD → Alimentação  • remove duplicatas     │
    → 1234.56         • UBER → Transporte    • saldo                 ▼
  • 15/10/2026        • sem acentos/caixa    • gastos/categoria  ┌──────────────┐
    → 2026-10-15                             • alertas orçamento │ 5. COTAÇÃO   │
  • valida datas                                                 │ USD (API)    │
                                                                 └──────────────┘
```

Exemplo de saída (`npm start`):

```
RELATÓRIO DO EXTRATO
────────────────────────────────────────
Transações: 13 (duplicatas removidas: 1)
Saldo do período: R$ 933,36

Gastos por categoria:
  Alimentação    R$ 543,25
  Transporte     R$ 205,30
  Lazer          R$ 77,80
  ...

Alertas de orçamento:
  ATENÇÃO: Alimentação (91% do limite)
  ATENÇÃO: Transporte (82% do limite)
  ESTOURADO: Lazer (111% do limite)
```

---

## Os testes

### Resumo

| Tipo | Quantidade | % |
|---|:---:|:---:|
| **Unitários** | **51** | 91% |
| **Integração** | **5** | 9% |
| **Total** | **56** | 100% |

**Cobertura de código:** 100% de linhas, funções, instruções e ramos (*branches*).
**Tempo de execução:** menos de 1 segundo.

### Por arquivo

| Arquivo de teste | Testes | Tipo | O que valida |
|---|:---:|---|---|
| `parser.test.js` | 20 | Unitário | Conversão de valores e datas, limpeza de texto e leitura do CSV |
| `categorizador.test.js` | 10 | Unitário | Classificação das transações por regras, acentos e imutabilidade |
| `analise.test.js` | 10 | Unitário | Duplicatas, saldo, gastos por categoria, ranking e alertas de orçamento |
| `cotacao.test.js` | 11 | Unitário | Conversão para dólar com **API mockada**, cache e tratamento de erros |
| `relatorio.test.js` | 5 | Integração | Pipeline completo com o arquivo CSV real e snapshot do relatório |

### Testes unitários (51)

Testam uma função isolada por vez, sem depender do resto do sistema, de arquivos ou da internet.

No caso da cotação do dólar, a API externa é substituída por um mock (`jest.fn()`). Assim o
teste continua unitário: não depende da internet, da API estar no ar nem do valor do dólar no
dia. Os testes passam até com o Wi-Fi desligado.

### Testes de integração (5)

Testam os módulos funcionando juntos: o `relatorio.test.js` lê o arquivo `dados/extrato.csv`
de verdade e passa por todas as etapas (parser → categorizador → análise). Pegam erros que só
aparecem quando um módulo entrega dados para o outro.

### Técnicas de teste aplicadas

| Técnica | Exemplo no projeto |
|---|---|
| **Análise de valor limite** | Alertas de orçamento testados em 79%, **80%**, **100%** e 101%, exatamente nas bordas onde o comportamento muda |
| **Particionamento de equivalência** | Um representante de cada categoria (Alimentação, Transporte, Lazer, Educação, Saúde, Renda, Outros) |
| **Testes negativos** | Entradas que **devem** gerar erro: data `31/02/2026`, valor `"abc"`, linha mal formatada, API fora do ar |
| **Testes orientados a dados** | `test.each` roda a mesma lógica com uma tabela de entradas e saídas |
| **Teste de regressão** | Snapshot do relatório: o Jest avisa se uma mudança alterar o resultado sem querer |
| **Dublês de teste** | Mock (`jest.fn`), spy (`jest.spyOn`) e relógio falso (`jest.useFakeTimers`) |
| **Caixa-preta** | A maioria dos testes verifica só entrada → saída |
| **Caixa-branca** | Cobertura de 100% dos ramos, garantindo que todo `if` foi exercitado |

### Recursos do Jest utilizados

| Recurso | Para que serve | Onde |
|---|---|---|
| `describe` / `test` / `expect` | Estrutura básica de um teste | Todos |
| `toBe`, `toEqual`, `toThrow`, `toMatchObject`, `toContainEqual`, `toHaveLength` | Matchers: as comparações | Todos |
| `test.each` | Mesmo teste com vários dados | parser, categorizador, análise, cotação |
| `beforeEach` / `afterEach` | Preparar e limpar o ambiente de cada teste | análise, cotação |
| `resolves` / `rejects` | Testar funções assíncronas (Promises) | cotação |
| `jest.fn()` + `mockResolvedValue` | Criar uma API falsa | cotação |
| `jest.spyOn(global, 'fetch')` | Interceptar chamadas HTTP | cotação |
| `jest.useFakeTimers()` | "Viajar no tempo" para expirar o cache sem esperar | cotação |
| `toMatchSnapshot()` | Teste de regressão | relatório |
| `--coverage` + `coverageThreshold` | Medir cobertura e exigir mínimo de 90% | `package.json` |
| `--watch` | Reexecutar os testes ao salvar o arquivo | `npm run test:watch` |

---

## Um bug real encontrado pelos testes

Durante o desenvolvimento, o teste `rejeita valor inválido: "R$ "` **falhou**.

A função `converterValor("R$ ")` devolvia **`0`** em vez de lançar erro, porque em JavaScript
`Number('')` é `0`. Sem o teste, um campo de valor vazio no extrato viraria silenciosamente uma
transação de R$ 0,00.

A correção foi uma linha em `src/parser.js`, e o teste garante que o bug **nunca mais volta**.
É exatamente para isso que testes automatizados existem.

---

## Como rodar

**Pré-requisito:** [Node.js](https://nodejs.org) 18 ou superior.

```bash
git clone https://github.com/alissonmoreira7/extrato-financeiro-jest.git
cd extrato-financeiro-jest
npm install                # instala o Jest

npm test                   # roda os 56 testes
npm run test:verbose       # lista o nome de cada teste
npm run test:coverage      # testes + relatório de cobertura
npm run test:watch         # modo watch: reexecuta ao salvar
npm start                  # roda o programa com dados/extrato.csv
```

Para analisar outro extrato: `node src/index.js caminho/do/arquivo.csv`
(formato: `data;descricao;valor` → `15/10/2026;IFOOD *PEDIDO;-45,90`).

---

## Estrutura

```
extrato-financeiro-jest/
├── src/
│   ├── parser.js           # 1. leitura e limpeza do CSV
│   ├── categorizador.js    # 2. categorização por regras
│   ├── analise.js          # 3. saldo, duplicatas, alertas
│   ├── cotacao.js          # conversão para dólar (API externa + cache)
│   ├── relatorio.js        # junta todas as etapas
│   └── index.js            # programa de terminal (npm start)
├── tests/
│   ├── parser.test.js          # 20 testes unitários
│   ├── categorizador.test.js   # 10 testes unitários
│   ├── analise.test.js         # 10 testes unitários
│   ├── cotacao.test.js         # 11 testes unitários (mocks)
│   ├── relatorio.test.js       #  5 testes de integração
│   └── __snapshots__/          # snapshot do relatório
├── dados/extrato.csv       # extrato de exemplo
└── .github/workflows/
    └── testes.yml          # integração contínua (GitHub Actions)
```

---

## Integração contínua

O arquivo `.github/workflows/testes.yml` configura o **GitHub Actions**: a cada `push` ou
*pull request*, o GitHub roda todos os testes e a cobertura numa máquina limpa na nuvem.

- Se algum teste falhar, **ou** se a cobertura cair abaixo de **90%**, o commit é marcado com ❌.
- O selo no topo deste README mostra o status atual.

Isso mostra o Jest como é usado no mercado: protegendo o projeto **a cada commit**, e não só
quando alguém lembra de rodar os testes.

---

## Sobre o Jest

O [Jest](https://jestjs.io) é um framework de testes para JavaScript e TypeScript, criado pelo
Facebook (Meta) e hoje mantido pela OpenJS Foundation. É open source e um dos mais usados no
ecossistema JavaScript.

**Por que o Jest?**

- ✅ Configuração quase zero: instala e já funciona.
- ✅ Tudo embutido: asserções, mocks, cobertura e snapshot, sem bibliotecas extras.
- ✅ Rápido: roda os arquivos de teste em paralelo.
- ✅ Mensagens de erro claras, mostrando o valor esperado e o recebido.

**Limitações:**

- ⚠️ Focado em JavaScript/TypeScript.
- ⚠️ Com ESM puro (`import`/`export`) e TypeScript, precisa de configuração extra.
- ⚠️ Não testa a interface no navegador real; para isso existem ferramentas E2E como Cypress e Playwright.

---