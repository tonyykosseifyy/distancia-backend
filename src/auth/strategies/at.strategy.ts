import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type JWTPayload = {
    sub: string;
    email: string;
}

@Injectable()
export class ATStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "at-secret",

        })
    }

    validate(payload: JWTPayload) : JWTPayload {
        return payload;
    }
}