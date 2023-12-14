import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import {z} from 'zod'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

export async function mealsRoutes (app: FastifyInstance) {
    app.get('/' 
    ,{
        preHandler: [checkSessionIdExists]
    },
    async(request, reply) => {
        return checkSessionIdExists
    }
    )
}