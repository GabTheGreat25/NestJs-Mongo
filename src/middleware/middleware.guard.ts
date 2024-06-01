import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./middleware.verifyToken";
import { ENV } from "src/config";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    return token
      ? this.tokenService.isTokenBlacklisted()
        ? false
        : (() => {
            try {
              request.user = this.jwtService.verify(token, {
                secret: ENV.ACCESS_TOKEN_SECRET,
              });
              return true;
            } catch (error) {
              return false;
            }
          })()
      : false;
  }
}
