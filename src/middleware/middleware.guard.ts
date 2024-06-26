import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./middleware.verifyToken";
import { ENV } from "src/config";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    return token
      ? this.tokenService.isTokenBlacklisted()
        ? false
        : (() => {
            request.user = this.jwtService.verify(token, {
              secret: ENV.ACCESS_TOKEN_SECRET,
            });

            const requiredRoles = this.reflector.get<string[]>(
              "roles",
              context.getHandler(),
            );

            if (!requiredRoles || requiredRoles.includes(request.user.role)) {
              return true;
            }
          })()
      : false;
  }
}
