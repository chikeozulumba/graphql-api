import { gql } from 'apollo-server-express'

export default gql `
    type Message {
       id: ID!
       body: String!
       sender: User!
       chat: Chat!
       createdAt: String!
       updatedAt: String!
    }
`