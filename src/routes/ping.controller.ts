import { Controller, Get } from "@nestjs/common";
import { PATH } from "src/constants";

@Controller()
export class PingController {
  @Get(PATH.PING)
  ping() {
    return "Pong!";
  }
}
