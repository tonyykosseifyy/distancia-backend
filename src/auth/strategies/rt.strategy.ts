import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                RTStrategy.extractJWTFromCookie 
            ]),
            secretOrKey: "rt-secret",
            passReqToCallback: true,
            ignoreExpiration: false,

        })
    }
    private static extractJWTFromCookie(req: Request): string | null {
        if (req.cookies && req.cookies.refresh_token) {
            return req.cookies.refresh_token;
        }
        return null;
    }

    validate(req: Request, payload: any) : void {
        // get the refresh token from the request cookie 
        // and add it to the payload

        const refreshToken = req.cookies?.refresh_token;
        // const refreshToken = req.get("authorization").replace("Bearer ", "").trim();
        return {
            refreshToken,
            ...payload,
        };
    }
}
