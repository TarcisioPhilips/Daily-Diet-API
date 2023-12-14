import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import {z} from 'zod'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'
import { Knex } from 'knex'

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

    

}