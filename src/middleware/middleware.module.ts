import { Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { ENV } from "src/config";
import { TokenService } from "./middleware.verifyToken";
import { TransactionMiddleware } from "./middleware.transaction";

@Global()
@Module({
  imports: [
    NestJwtModule.register({
      secret: ENV.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [TokenService],
  exports: [NestJwtModule, TokenService],
})
export class JwtModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes("*");
  }
}
