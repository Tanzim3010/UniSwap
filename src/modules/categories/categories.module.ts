import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "@/modules/auth/auth.module";

import { CategoriesController } from "@/modules/categories/categories.controller";
import { CategoriesService } from "@/modules/categories/categories.service";
import { Category } from "@/modules/categories/entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
