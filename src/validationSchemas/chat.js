import Joi from "./joi"

export const startChat = userId => Joi.object().keys({
    title: Joi.string().min(0).max(255).label('Title'),
    userIds: Joi.array().min(1).max(100).unique().items(
        Joi.string().objectId().not(userId).label('User ID')
    ).label('User IDs')
})