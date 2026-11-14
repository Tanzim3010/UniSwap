import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { RolesGuard } from "@/common/guard/roles.guard";
import { ValidationPipe } from "@/common/pipes/validation.pipe";

import { CategoriesService } from "@/modules/categories/categories.service";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/modules/categories/dto/category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  create(@Body(new ValidationPipe()) dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  deactivate(@Param("id", ParseUUIDPipe) id: string) {
    return this.categoriesService.deactivate(id);
  }
}
