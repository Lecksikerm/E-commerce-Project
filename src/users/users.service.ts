import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../dal/entities/user.entity';

export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      select: ['id', 'username', 'email', 'role', 'password'],
    });
  }

  async findUserByName(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  async findById(id: string): Promise<SafeUser> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as SafeUser;
  }

  async addUser(user: Partial<User>): Promise<SafeUser> {
    const existingEmail = await this.userRepo.findOne({
      where: { email: user.email },
      select: ['email'],
    });

    if (existingEmail) {
      throw new ConflictException(`Email '${existingEmail.email}' already exists`);
    }

    if (user.username) {
      const existingUsername = await this.userRepo.findOne({
        where: { username: user.username },
        select: ['username'],
      });

      if (existingUsername) {
        throw new ConflictException(`Username '${existingUsername.username}' already exists`);
      }
    }

    const newUser = this.userRepo.create(user);
    const savedUser = await this.userRepo.save(newUser);
    // Remove password before returning
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as SafeUser;
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepo.find();

    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as SafeUser;
    });
  }
}
