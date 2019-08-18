import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import mongoose from 'mongoose'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import {
    APP_PORT,
    IN_PROD,
    DB_URL,
    SESSION_NAME,
    SESSION_SECRET,
    SESSION_LIFETIME,
    REDIS_HOST,
    REDIS_PASSWORD,
    REDIS_PORT,
} from '../config';
import schemaDirectives from './directives'

(async() => {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true })
            // mongoose.set('debug', true)

        const app = express()

        app.disable('x-powered-by')

        const RedisStore = connectRedis(session)
        const store = new RedisStore({
            host: REDIS_HOST,
            port: REDIS_PORT,
            pass: REDIS_PASSWORD,
        })

        app.use(session({
            name: SESSION_NAME,
            secret: SESSION_SECRET,
            resave: false,
            rolling: true,
            saveUninitialized: false,
            cookie: {
                maxAge: parseInt(SESSION_LIFETIME),
                sameSite: true,
                secure: IN_PROD,
            },
            store,
        }))

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            schemaDirectives,
            playground: true,
            playground: IN_PROD ? false : {
                settings: {
                    'request.credentials': 'include'
                }
            },
            context: ({ req, res }) => ({ req, res })
        })

        server.applyMiddleware({ app, cors: true })

        app.listen({ port: 4000 },
            () => console.log(`Server running on port http://localhost:${APP_PORT}/graphql`)
        )
    } catch (error) {
        console.log(error)
    }
})()