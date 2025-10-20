import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Connection } from "mongoose";
import { RESOURCE } from "src/constants";
import { SessionRequest } from "src/types";

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const session = await this.connection.startSession();
    session.startTransaction();

    (req as unknown as SessionRequest).session = session;

    res.on(RESOURCE.FINISH, async () => {
      if (
        res.statusCode >= HttpStatus.OK &&
        res.statusCode < HttpStatus.BAD_REQUEST
      ) {
        await session.commitTransaction();
      } else await session.abortTransaction();

      session.endSession();
    });

    next();
  }
}
