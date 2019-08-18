import Joi from "../joi";

export const isObjectID = Joi.object().keys({
    id: Joi.string().objectId().label('Object ID')
})