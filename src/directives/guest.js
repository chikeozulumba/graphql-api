import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver } from "graphql";
import { ensureSignedOut } from "../auth";

export default class GuestDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field
        field.resolve = function(...args) {
            const [, , context] = args
            ensureSignedOut(context.req)
            return resolve.apply(this, args)
        }
    }
}