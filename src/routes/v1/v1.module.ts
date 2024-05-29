import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { UsersModule } from "./users/users.module";
import { RESOURCE } from "src/constants";
import { TestsModule } from "./tests/tests.module";

@Module({
  imports: [
    UsersModule,
    RouterModule.register([
      {
        path: RESOURCE.API + RESOURCE.V1,
        module: V1Module,
        children: [
          {
            path: RESOURCE.USERS,
            module: UsersModule,
          },
          {
            path: RESOURCE.TESTS,
            module: TestsModule,
          },
        ],
      },
    ]),
    TestsModule,
  ],
})
export class V1Module {}
