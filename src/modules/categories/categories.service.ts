import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Category } from "@/modules/categories/entities/category.entity";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/modules/categories/dto/category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    });
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug, isActive: true },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  async findActiveById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
    });

    if (!category) {
      throw new NotFoundException("Active category not found");
    }

    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug ?? this.createSlug(dto.name);
    this.validateSlug(slug);
    await this.ensureSlugAvailable(slug);

    const category = this.categoryRepository.create({
      name: dto.name,
      slug,
      description: dto.description ?? null,
    });

    return this.categoryRepository.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);

    if (dto.slug && dto.slug !== category.slug) {
      await this.ensureSlugAvailable(dto.slug, id);
    }

    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async deactivate(id: string): Promise<void> {
    const category = await this.findById(id);
    category.isActive = false;
    await this.categoryRepository.save(category);
  }

  private async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  private async ensureSlugAvailable(
    slug: string,
    exceptId?: string,
  ): Promise<void> {
    const existing = await this.categoryRepository.findOne({ where: { slug } });

    if (existing && existing.id !== exceptId) {
      throw new ConflictException("A category with this slug already exists");
    }
  }

  private createSlug(name: string): string {
    const slug = name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120)
      .replace(/-$/g, "");

    this.validateSlug(slug);
    return slug;
  }

  private validateSlug(slug: string): void {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new BadRequestException(
        "Category name must produce a valid URL slug or provide one explicitly",
      );
    }
  }
}
