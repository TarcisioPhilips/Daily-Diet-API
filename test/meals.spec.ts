import {expect,it, beforeAll, afterAll, describe, beforeEach} from 'vitest'
import request from 'supertest'
import {execSync} from 'node:child_process'
import{app} from '../src/app'

describe('User routes', () => {
  beforeAll( async () => {
    await app.ready()
  })
  
  afterAll( async () => {
    await app.close()
  })

  // beforeEach(()=> {
  //   execSync('npm run knex migrate:rollback --all') // rodas as migrations para excluir as tabelas
  //   execSync('npm run knex migrate:latest') // rodas as migrations para criar tabelas do banco
  // })

  
  it('should be able to create a new user',async () =>{

    const response = await request(app.server)
      .post('/users')
      .send({
          "name":"Tar4",
          "email":"tar@email.com",
          "adress":"meu endereço lindo",
          "weight":10.567,
          "height":2
      }).expect(201)

  })

//   it('should be able to create a new meal',async () =>{

//     const response = await request(app.server)
//       .post('/meals')
//       .send({
//         name: 'Comida',
//         description: 'Almoço',
//         isOnTheDiet: true
//       }).expect(201)

//       const cookie = createMealsResponse.get('Set-Cookie')

//   })

//   it('should be able to list all transactions', async () => {
//     const createTransactionResponse = await request(app.server)
//     .post('/transactions')
//     .send({
//       title: 'New transaction',
//       amount: 5000,
//       type: 'credit'
//     })

//     const cookie = createTransactionResponse.get('Set-Cookie')

//     const listTransactionsResponse = await request(app.server)
//       .get('/transactions')
//       .set('Cookie', cookie)
//       .expect(200)

//     expect(listTransactionsResponse.body.transactions).toEqual([
//       expect.objectContaining({
//         title: 'New transaction',
//         amount: 5000,
//       })
//     ])

//   })

//   it('should be able to get a specific transaction', async () => {
//     const createTransactionResponse = await request(app.server)
//     .post('/transactions')
//     .send({
//       title: 'New transaction',
//       amount: 5000,
//       type: 'credit'
//     })

//     const cookie = createTransactionResponse.get('Set-Cookie')

//     const listTransactionsResponse = await request(app.server)
//       .get('/transactions')
//       .set('Cookie', cookie)
//       .expect(200)

//     const transactionId = listTransactionsResponse.body.transactions[0].id

//     const getTransactionsResponse = await request(app.server)
//       .get(`/transactions/${transactionId}`)
//       .set('Cookie', cookie)
//       .expect(200)

//     expect(getTransactionsResponse.body.transaction).toEqual(
//       expect.objectContaining({
//         title: 'New transaction',
//         amount: 5000,
//       })
//     )

//   })

//   it('should be able to get the summary', async () => {
//     const createTransactionResponse = await request(app.server)
//     .post('/transactions')
//     .send({
//       title: 'Credit transaction',
//       amount: 3000,
//       type: 'credit',
//     })

//     const cookies = createTransactionResponse.get('Set-Cookie')

//     await request(app.server)
//       .post('/transactions')
//       .set('Cookie', cookies)
//       .send({
//         title: 'Debit transaction',
//         amount: 2000,
//         type: 'debit',
//       })

//     const summaryResponse = await request(app.server)
//       .get('/transactions/summary')
//       .set('Cookie', cookies)
//       .expect(200)

//     expect(summaryResponse.body.summary).toEqual({
//       amount:1000,
//     })

//   })

// })


