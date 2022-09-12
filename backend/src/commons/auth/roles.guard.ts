import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/apis/users/users.service';

// const matchRoles = (roles: string[], userRoles: string) => {
//   return roles.some((role) => role === userRoles);
// };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, //
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const userId = request.user.id;
      const user = await this.userService.findOne({ userId });
      return roles.includes(user.role);
    }

    return false;

    // const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    //     if (!requiredRoles) {
    //       return true;
    //     }

    //     const req = context.switchToHttp().getRequest() as any;
    //     const user = req.user;
    //     if (!user) {
    //       throw new ForbiddenException('User does not exist');
    //     }
    //     return matchRoles(requiredRoles, user.role);
    //   }
  }
}
