import { RouteTree } from "@nestjs/core";
import { RESOURCE } from "src/constants";
import { TestsChildModule, TestsModule, UsersModule } from "../v1";

export const v1Routes: RouteTree[] = [
  { path: RESOURCE.USERS, module: UsersModule },
  { path: RESOURCE.TESTS, module: TestsModule },
  { path: RESOURCE.TESTS_CHILD, module: TestsChildModule },
];

export const v1Modules = v1Routes.map((r) => r.module);
