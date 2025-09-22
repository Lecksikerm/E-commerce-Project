import { DataSource } from 'typeorm';
import { User } from '../src/dal/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function ensureAdmin() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',       // your DB host
    port: 5432,              // your DB port
    username: 'postgres',    // your DB user
    password: 'postgres',// your DB password
    database: 'e-commerce',      // your DB name
    entities: [User],
    synchronize: false,      // false in production
  });

  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);

  const adminId = '9428d83c-5087-4141-87e0-49bf6b0f6d20';
  let admin = await userRepo.findOneBy({ id: adminId });

  if (!admin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10); // choose a secure password
    admin = userRepo.create({
      id: adminId,
      email: 'admin1@gmail.com',
      username: 'admin1',
      password: hashedPassword,
      role: 'admin',
      name: 'Admin User',
    });

    await userRepo.save(admin);
    console.log(' Admin user created successfully');
  } else {
    console.log(' Admin already exists');
  }

  await dataSource.destroy();
}

ensureAdmin().catch(console.error);
