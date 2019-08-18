import mongoose, { Schema } from 'mongoose'
import User from './user';

const USER_LIMIT = 5

const chatSchema = new mongoose.Schema({
    title: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {
    timestamps: true
})

chatSchema.pre('save', async function() {
    if (!this.title) {
        const users = await User.where('_id').in(this.users).limit(USER_LIMIT).select('name')
        const title = users.map(u => u.name).join(', ')
        this.title = this.users.length > 5 ? `${title}...` : title
    }
})

const Chat = mongoose.model('Chat', chatSchema)

export default Chat