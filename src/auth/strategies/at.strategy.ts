import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Request } from 'express';

type JWTPayload = {
    sub: number;
    email: string;
}

@Injectable()
export class ATStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ATStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: 'at-secret',
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  
   validate(payload: JWTPayload) : JWTPayload {
        return payload;
   }
}

