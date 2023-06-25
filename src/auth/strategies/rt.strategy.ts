import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {Request} from "express";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "rt-secret",
            passReqToCallback: true,

        })
    }

    validate(req: Request, payload: any) : void {
        const refreshToken = req.get("authorization").replace("Bearer ", "").trim();
        return {
            refreshToken,
            ...payload,
        };
    }
}