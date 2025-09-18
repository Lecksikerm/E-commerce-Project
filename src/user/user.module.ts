import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/guards/auth.guard';

@Module({
  imports: [
    forwardRef(() => AuthModule), 
  ],
  controllers: [UserController], 
  providers: [AuthGuard], 
})
export class UserModule {}

