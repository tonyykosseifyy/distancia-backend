import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { userType } from 'src/auth/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  // get route, /me, return user info

  @Get('me')
  getMe(@GetCurrentUserId() userId: number): Promise<userType> {
    return this.userService.getMe(userId);
  }

}

