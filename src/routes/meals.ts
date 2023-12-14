import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import {z} from 'zod'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

export async function mealsRoutes (app: FastifyInstance) {
    app.post('/', 
    {
        preHandler:[checkSessionIdExists]
    }, 


    async(request, reply) => {
        const {sessionId} = request.cookies
        // console.log('sessionId:',sessionId)

        const [user] = await knex('users')
        .where('session_id', sessionId)
        .select('id')

        const userId = user.id
        // console.log('userId:', userId)

        const createUserBodySchema = z.object({
            name:z.string(),
            description:z.string(),
            isOnTheDiet:z.boolean()
        })

        const {name, description, isOnTheDiet} = createUserBodySchema.parse(request.body)

        await knex('meals').insert({
            id:crypto.randomUUID(),
            user_id: userId,
            name,
            description,
            isOnTheDiet
        }).returning('*')

        return reply.status(201).send()
    }
    )

    app.get('/', 
    {
        preHandler: [checkSessionIdExists]
    }, async (request, reply) => {
        const {sessionId} = request.cookies
        // console.log(sessionId)

        const [user] = await knex('users')
            .select('id')
            .where('session_id', sessionId)

        const userId = user.id

        const meal = await knex('meals')
            .select('*')
            .where('user_id', userId)

        return reply.status(200).send(meal)
    })

    app.get('/:mealId', 
    {
        preHandler: [checkSessionIdExists]
    },async (request,reply) => {
        const {sessionId} = request.cookies

        const [user] = await knex('users')
            .select('id')
            .where('session_id', sessionId)

        const userId = user.id

        const getMealsParamsSchema = z.object({
            mealId:z.string().uuid()
        })

        const {mealId} = getMealsParamsSchema.parse(request.params)
        
        const meal = await knex('meals')
        .select('*')
        .where({
            user_id: userId,
            id: mealId
        })

        return reply.status(200).send({meal})
    })

    app.get('/summary'
    , 
    {preHandler: [checkSessionIdExists]}
    ,
     async (request, reply) => {
        const {sessionId} = request.cookies

        const [user] = await knex('users')
        .select('id')
        .where('session_id', sessionId)

        const userId = user.id

        const [count] = await knex('meals')
        .count('id', {
          as: 'Total de refeições registradas',
        })
        .where('user_id', userId)

        const refDieta = await knex('meals')
            .count('id', { as: 'Total de refeições dentro da dieta' })
            .where('isOnTheDiet', true)
            .andWhere('user_id', userId)

        const refForaDieta = await knex('meals')
            .count('id', { as: 'Total de refeições fora da dieta' })
            .where('isOnTheDiet', false)
            .andWhere('user_id', userId)

        const summary = {
            'Total de refeições registradas': parseInt(
            JSON.parse(JSON.stringify(count))['Total de refeições registradas'],
            ),

            'Total de refeições dentro da dieta': parseInt(
            JSON.parse(JSON.stringify(refDieta))[0][
                'Total de refeições dentro da dieta'
            ],
            ),

            'Total de refeições fora da dieta': parseInt(
            JSON.parse(JSON.stringify(refForaDieta))[0][
                'Total de refeições fora da dieta'
            ],
            ),
        }

        return {summary}

    })

    app.put('/:mealId', 
    {
        preHandler: [checkSessionIdExists]
    },async (request,reply) => {
        const {sessionId} = request.cookies

        const [user] = await knex('users')
            .select('id')
            .where('session_id', sessionId)

        const userId = user.id

        const getMealsParamsSchema = z.object({
            mealId:z.string().uuid()
        })

        const {mealId} = getMealsParamsSchema.parse(request.params)
        
        const editMealsBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            isOnTheDiet: z.boolean(),
        })

        const {name, description, isOnTheDiet} =editMealsBodySchema.parse(request.body)

        const meal = await knex('meals')
        .where({
            user_id: userId,
            id: mealId
        })
        .first()
        .update({
            name,
            description,
            isOnTheDiet
        })

        if(!meal) {
            return reply.status(404).send({
                error: "Meal not Found."
            })
        }

        return reply.status(202).send()
    })

    app.delete('/:mealId', 
    {
        preHandler: [checkSessionIdExists]
    },async (request,reply) => {
        const {sessionId} = request.cookies

        const [user] = await knex('users')
            .select('id')
            .where('session_id', sessionId)

        const userId = user.id

        const getMealsParamsSchema = z.object({
            mealId:z.string().uuid()
        })

        const {mealId} = getMealsParamsSchema.parse(request.params)
       
        const meal = await knex('meals')
        .where({
            user_id: userId,
            id: mealId
        })
        .first()
        .del()

        if(!meal) {
            return reply.status(401).send({
                error: "Unauthorized"
            })
        }

        return reply.status(202).send('Meal deleted')
    })

}