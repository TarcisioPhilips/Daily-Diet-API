# Daily-Diet-API

### Regras da aplicação

- Deve ser possível criar um usuário
- Deve ser possível identificar o usuário entre as requisições
- Deve ser possível registrar uma refeição feita, com as seguintes informações:
    
    *As refeições devem ser relacionadas a um usuário.*
    
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- Deve ser possível apagar uma refeição
- Deve ser possível listar todas as refeições de um usuário
- Deve ser possível visualizar uma única refeição
- Deve ser possível recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência de refeições dentro da dieta
- O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

---

### Rotas da aplicação

Criar novo usuário
```
POST /users
```
Criar novo registro de refeição
```
POST /meals
```
Listar todas refeições registradas pelo usuário
```
GET /meals
```
Listar uma refeição específica registrada pelo usuário
```
GET /meals/:${meal_id}
```
Mostrar um resumo geral das refeições cadastradas pelo usuário (total de refeições, refeições dentro da dieta e refeições fora da dieta)
```
GET /meals/summary
```
Deletar uma refeição cadastrada
```
DELETE /meals/:${meal_id}
```
Editar uma refeição cadastrada
```
PUT /meals/:${meal_id}
```