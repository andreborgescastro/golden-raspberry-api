# golden-raspberry-api
API RESTful para listagem de indicados e vencedores do Golden Raspberry.

## Ambiente recomendado
- Node.js 20 LTS (ou superior compatível)
- npm 10+
- SQLite (o driver `sqlite3` já está incluído nas dependências)

## Primeiros passos
1. Clone o projeto:
   ```bash
   git clone https://github.com/andreborgescastro/golden-raspberry-api.git
   cd golden-raspberry-api
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo de variáveis de ambiente:
   ```bash
   cp .env-example .env
   ```
4. Ajuste as variáveis descritas abaixo conforme a sua necessidade.

## Variáveis de ambiente
O arquivo `.env` controla a origem dos dados e a persistência do banco:
- `MOVIES_CSV_PATH`: caminho para o CSV que alimenta a aplicação. Por padrão aponta para `assets/Movielist.csv`. É possível usar caminhos absolutos ou relativos à raiz do projeto.

> Em cada inicialização a aplicação lê o CSV indicado e populará o banco conforme os dados encontrados.

## Executando a aplicação
- Ambiente de desenvolvimento (com live-reload):
  ```bash
  npm run start:dev
  ```
- Ambiente padrão (sem watch):
  ```bash
  npm run start
  ```
- Ambiente de produção (compilado):
  ```bash
  npm run build
  npm run start:prod
  ```

A API inicia por padrão na porta `3000`. Utilize a variável `PORT` caso precise alterá-la.

## Testes de integração
- Parae executar os testes de integração (Jest + Supertest):
  ```bash
  npm run test:e2e
  ```

Durante os testes, o arquivo `test/setup-env.ts` é responsável por apontar o path do CSV para validação, através da variável de ambiente `MOVIES_CSV_PATH`. Por padrão está configurada para `test/fixtures/test-accepted-csv-sample.csv`. Para testar outros arquivos, basta alterar o `test/setup-env.ts`

## Contrato da API
### GET `/awards/intervals`
Retorna os produtores com os menores e maiores intervalos entre vitórias consecutivas.

**Resposta (200):**
```json
{
  "min": [
    {
      "producer": "Producer Name",
      "interval": 1,
      "previousWin": 1980,
      "followingWin": 1981
    }
  ],
  "max": [
    {
      "producer": "Another Producer",
      "interval": 13,
      "previousWin": 1960,
      "followingWin": 1973
    }
  ]
}
```

- `min`: lista de produtores empatados com o menor intervalo.
- `max`: lista de produtores empatados com o maior intervalo.
- `interval`: diferença (em anos) entre as vitórias `previousWin` e `followingWin`.

## Exemplos de consumo (cURL)
- Obter intervalos de produtores:
  ```bash
  curl -s http://localhost:3000/awards/intervals | jq
  ```

## Observações adicionais
- A aplicação executa a leitura do CSV automaticamente em cada inicialização, permitindo atualizar os dados apenas alterando o arquivo e reiniciando o servidor. Para alterar o CSV, basta interromper a execução da aplicação, e alterar no arquivo .env a variável `MOVIES_CSV_PATH`. E então, iniciar a aplicação novamente a seção `Executando a aplicação`
