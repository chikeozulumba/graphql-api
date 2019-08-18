import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver } from "graphql";
import { ensureSignedIn } from "../auth";

export default class AuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field
        field.resolve = function(...args) {
            const [, , context] = args
            ensureSignedIn(context.req)
            return resolve.apply(this, args)
        }
    }
}