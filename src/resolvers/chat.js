import Joi from 'joi';
import { startChat } from '../validationSchemas'
import { User, Chat, Message } from '../models';
import { UserInputError } from 'apollo-server-core';

export default {
    Mutation: {
        startChat: async(root, args, { req }, info) => {
            const { title, userIds } = args
            const { userId } = req.session
            await Joi.validate(args, startChat(userId), { abortEarly: true })
            const idsFound = await User.where('_id').in(userIds).countDocuments()
            if (idsFound !== userIds.length) {
                throw new UserInputError('One or more User IDs is(are) invalid.')
            }
            userIds.push(userId)
            const createChat = await Chat.create({ title, users: userIds })
            await User.updateMany({ _id: { '$in': userIds } }, {
                $push: { chats: createChat }
            })
            return createChat
        }
    },
    Chat: {
        messages: async(chat, args, context, info) => {
            return Message.find({ chat: chat.id })
        },
        users: async(chat, args, context, info) => {
            return (await chat.populate('users').execPopulate()).users
        },
        lastMessage: async(chat, args, context, info) => {
            return (await chat.populate('lastMessage').execPopulate()).lastMessage
        }
    }
}