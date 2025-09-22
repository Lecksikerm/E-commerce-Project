import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../dal/entities/user.entity';

@Injectable()
export class UsersService {
  findUserByUsernameOrEmail(username: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  // Find a user by username
  async findUserByName(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  // Add a new user and save to the database
  async addUser(user: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create(user); // prepares entity
    return this.userRepo.save(newUser);         // persists in DB
  }
}






