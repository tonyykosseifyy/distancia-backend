import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import * as argon2 from "argon2";
import { Tokens, userType } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
        ) {}
    
    async signupLocal(dto : AuthDto) {
        const oldUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        if (oldUser) throw new ForbiddenException("User already exists");

        const hash = await this.hashPassword(dto.password);

        const newUser = await this.prisma.user.create({
            data : {
                email: dto.email,
                hash,
            }
        })
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRTHash(newUser.id, tokens.refresh_token);

        return tokens; 
    }
    async signinLocal(dto : AuthDto) {
         const user =  await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        }
        );
        if (!user) throw new ForbiddenException("Invalid credentials");
        const passwordMatches = await bcrypt.compare(dto.password, user.hash);
        if (!passwordMatches) throw new ForbiddenException("Invalid credentials");
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRTHash(user.id, tokens.refresh_token);

        return tokens ;
    }
    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where : {
                id: userId,
                hashedRt: {
                    not: null,
                }
            },
            data: {
                hashedRt: null
            }
        })
    }
    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (!user || !user.hashedRt) throw new ForbiddenException("Invalid credentials");
        const rtMatches = await argon2.verify(user.hashedRt, rt);

        if (!rtMatches) throw new ForbiddenException("Invalid credentials");
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRTHash(user.id, tokens.refresh_token);
        
        return tokens ;

    }

    private async updateRTHash(userId: number, rt: string) {
        const hash = await this.hashToken(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRt: hash
            }
        })
    }

    
    private hashPassword(pass: string) {
        return bcrypt.hash(pass, 10);
    }
    private hashToken(token: string) {
        return argon2.hash(token);
    }
   
    private async getTokens(userId: number, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([

      this.jwtService.signAsync({
            sub : userId,
            email,

        }, {
            secret: "at-secret",
            expiresIn: 15 * 60,
        }), 

      this.jwtService.signAsync({
        sub : userId,
        email,

    }, {
        secret : "rt-secret",
        expiresIn: 7 * 24 * 60 * 60,
        }), 
    ]);
        return {
            access_token: at,
            refresh_token: rt,
        }
    }

   
}
