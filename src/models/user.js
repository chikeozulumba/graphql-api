import mongoose, { Schema } from 'mongoose'
import bcrypt, { compare } from 'bcryptjs'

const salt = bcrypt.genSaltSync(10);
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'Email must be valid'],
        validate: {
            validator: async email => User.dontExist({ email }),
            message: ({ value }) => `Email had already been taken`
        }
    },
    username: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: async username => User.dontExist({ username }),
            message: ({ value }) => `Username had already been taken`
        }
    },
    name: String,
    password: String,
    chats: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }]
}, {
    timestamps: true
})

userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hashSync(this.password, salt);
        }
    } catch (error) {
        next(error)
    }
    return next()
})

userSchema.statics.dontExist = async function(options) {
    return await this.where(options).countDocuments() === 0
}

userSchema.methods.matchesPassword = function(password) {
    return compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export default User