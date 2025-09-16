import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      userId: 1,
      username: 'john',
      email: 'john@gmail.com',
      password: '151500', // hashed '123456'
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findUserByName(username: string): User | undefined {
    return this.users.find((u) => u.username === username);
  }

  addUser(user: Partial<User>): User {
    const newUser: User = {
      ...user,
      userId: this.users.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    this.users.push(newUser);
    return newUser;
  }
}





