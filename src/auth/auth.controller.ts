import { Body, Controller, HttpCode, HttpStatus, Post, Req,Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import {  RtGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { Response } from 'express';
import { userType } from './types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDto, @Res() res: Response ) {
        return this.authService.signupLocal(dto, res);
    }
    
    @Public()
    @Post('local/signin')
    // @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDto, @Res() res: Response) {
        return this.authService.signinLocal(dto, res);
    }
    // @UseGuards(AtGuard)
    @Post('logout')
    // @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number, @Res() res: Response ) {
        return this.authService.logout(userId, res);
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUser("refreshToken") refreshToken: string, @Res() res: Response)  {
        return this.authService.refreshTokens(userId, refreshToken, res);
    }

}
