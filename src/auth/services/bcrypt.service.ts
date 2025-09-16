import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  async hash(payload: string, rounds = 10): Promise<string> {
    const salt = await bcrypt.genSalt(rounds);
    return bcrypt.hash(payload, salt);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
