import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../dal/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  //  Find user by either username or email
  async findUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      select: ['id', 'username', 'email', 'role', 'password'],
    });
  }

  //  Find a user by username only (if you need it elsewhere)
  async findUserByName(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  //  Find a user by id
  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  
  async addUser(user: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create(user); 
    return this.userRepo.save(newUser); 
  }

  
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }
}







