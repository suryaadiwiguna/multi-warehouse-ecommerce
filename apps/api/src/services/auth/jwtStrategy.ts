import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
const prisma = new PrismaClient();

const JwtStrategy = require("passport-jwt").Strategy;

const isProduction = process.env.NODE_ENV === "production";
const secretKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

function tokenExtractor(req: Request) {
    if (req.query.token && req.path.includes('/change/email')) return req.query.token
    if (req.query.token) return req.query.token;
    if (req.headers.cookie) return req.cookies['palugada-auth-token'];
    return null;
}

const jwtLogin = new JwtStrategy(
    {
        jwtFromRequest: tokenExtractor,
        secretOrKey: secretKey!
    },
    async (payload: any, done: (error: any, user: any, info?: any) => void) => {
        try {
            const user = await prisma.users.findUnique({ where: { id: payload.id } });
            if (user && user.email === payload.email) {
                done(null, { ...user, info: payload?.info });
            } else {
                done(null, false);
            }
        } catch (error) {
            console.error(error);
            done(error, false);
        }
    })

passport.use(jwtLogin);