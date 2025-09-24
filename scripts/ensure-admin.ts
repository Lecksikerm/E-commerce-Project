import { dataSource } from '../src/data-source'; 
import * as bcrypt from 'bcrypt';
import { User } from '../src/dal/entities/user.entity';

async function ensureAdmin() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const userRepo = dataSource.getRepository(User);
    const adminId = '9428d83c-5087-4141-87e0-49bf6b0f6d20';

    let admin = await userRepo.findOneBy({ id: adminId });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
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
  } catch (err) {
    console.error(' Error seeding admin:', err);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

ensureAdmin();

