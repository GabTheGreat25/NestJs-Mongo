import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ENV } from "src/config";
import { RESOURCE } from "src/constants";
import { TokenService } from "./middleware.verifyToken";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) return false;

    const isBlacklisted = this.tokenService.isTokenBlacklisted();
    if (isBlacklisted) return false;

    request.user = this.jwtService.verify(token, { secret: ENV.JWT_SECRET });

    const requiredRoles = this.reflector.get<string[]>(
      RESOURCE.ROLES,
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.includes(request.user.role))
      return true;

    return false;
  }
}
