import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import dataSourceOptions from './config/database.config';
import { Role } from './common/enums/role.enum';
import { UserStatus } from './common/enums/user-status.enum';
import { User } from './modules/users/entities/user.entity';

async function seedAdmin() {
  const dataSource = new DataSource({
    ...dataSourceOptions,
    entities: [User],
  });

  await dataSource.initialize();

  try {
    const repository = dataSource.getRepository(User);

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env',
      );
    }

    const existingAdmin = await repository.findOne({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin already exists:', email);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await repository.save(
      repository.create({
        email,
        passwordHash,
        displayName: 'Admin',
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        isVerified: true,
      }),
    );

    console.log('Admin user created successfully:', email);
  } finally {
    await dataSource.destroy();
  }
}

seedAdmin().catch((error) => {
  console.error('Admin seeding failed:', error);
  process.exitCode = 1;
});