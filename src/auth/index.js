import { AuthenticationError } from "apollo-server-core";
import { User } from "../models";
import { SESSION_NAME } from "../../config";

const signedIn = req => req.session.userId
const failMessage = `Incorrect email or password`

export const attemptSignIn = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new AuthenticationError(failMessage)
    }
    if (!await user.matchesPassword(password)) {
        throw new AuthenticationError(failMessage)
    }
    return user
}

export const ensureSignedIn = (req) => {
    if (!signedIn(req)) {
        throw new AuthenticationError('You must be signed in.')
    }
}

export const ensureSignedOut = (req) => {
    if (signedIn(req)) {
        throw new AuthenticationError('You are already signed in.')
    }
}

export const signOut = (req, res) => new Promise((resolve, reject) => {
    req.session.destroy(err => {
        if (err) reject(err)
        res.clearCookie(SESSION_NAME)
        resolve(true)
    })
})