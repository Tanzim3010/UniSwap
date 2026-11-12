import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email });

      if (includePassword) {
        query.addSelect('user.passwordHash');
      }

      return await query.getOne();
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }

  async createUser(data: Partial<User>): Promise<User> {
    try {
      if (!data.email) {
        throw new ConflictException('Email is required');
      }

      const existingUser = await this.findByEmail(data.email);

      if (existingUser) {
        throw new ConflictException('Email is already registered');
      }

      const user = this.userRepository.create(data);

      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    data: Partial<Pick<User, 'displayName'>>,
  ): Promise<User> {
    try {
      const user = await this.getUserById(id);

      Object.assign(user, data);

      return await this.userRepository.save(user);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.getUserById(id);

      await this.userRepository.remove(user);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}