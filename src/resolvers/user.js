import Joi from "joi";
import { User } from "../models";
import { UserInputError } from "apollo-server-core";
import { signUp, signIn, isObjectID } from "../validationSchemas"
import * as Auth from "../auth";

export default {
    Query: {
        users: (root, arg, { req, }, info) => {
            return User.find({})
        },
        user: async(root, args, { req, }, info) => {
            await Joi.validate(args, isObjectID)
            return User.findById(args.id)
        },
        me: (root, { id }, { req, }, info) => {
            return User.findById(req.session.userId)
        },
    },
    Mutation: {
        signUp: async(root, args, { req }, info) => {
            await Joi.validate(args, signUp, { abortEarly: false })
            const user = await User.create(args)
            req.session.userId = user.id
            return user
        },
        signIn: async(root, args, { req }, info) => {
            const { userId } = req.session
            if (userId) {
                return User.findById(userId)
            }
            await Joi.validate(args, signIn, { abortEarly: false })
            const user = await Auth.attemptSignIn(args.email, args.password)
            req.session.userId = user.id
            return user
        },
        signOut: async(root, args, { req, res }, info) => {
            return await Auth.signOut(req, res)
        }
    },
    User: {
        chats: async(user, args, context, info) => {
            return (await user.populate('chats').execPopulate()).chats
        }
    }
}