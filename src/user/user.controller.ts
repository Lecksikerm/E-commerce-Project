import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('user')
export class UserController {
    // constructor() { }

    // // Get current user route
    // @UseGuards(AuthGuard)
    // @Get('/me')
    // getUserInfo(@Req() request: Request) {
    //     return request.user;
    // }

}
