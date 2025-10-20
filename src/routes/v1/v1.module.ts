import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { RESOURCE } from "src/constants";
import { v1Modules, v1Routes } from "./v1.routes";

@Module({
  imports: [
    ...v1Modules,
    RouterModule.register([
      {
        path: RESOURCE.API + RESOURCE.V1,
        module: V1Module,
        children: v1Routes,
      },
    ]),
  ],
})
export class V1Module {}
