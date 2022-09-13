import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/apis/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, //
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const userId = context.switchToHttp()['args'][1].userId;
    console.log(context.switchToHttp().getRequest());
    // console.log(context.switchToHttp()['args'][2]);
    // console.log('12312312312', context.switchToHttp().getRequest() as any);
    // console.log(userId);
    const user = await this.userService.findOne({ userId });
    console.log(user.role);
    console.log(roles);
    if (!roles.includes(user.role)) {
      return false;
    }
    return true;
  }
}
