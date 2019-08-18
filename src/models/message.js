import mongoose, { Schema } from 'mongoose'

const messageSchema = new mongoose.Schema({
    body: String,
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema)

export default Message