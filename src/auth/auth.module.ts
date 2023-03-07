import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { FilesModule } from '../files/files.module';

@Module({
  //ce vei folosi in service
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topsecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User]),
    FilesModule,
  ],
  //ce vei folosi in controller/ declarare service
  providers: [AuthService, JwtStrategy],
  //declarare controller
  controllers: [AuthController],
  //ce se importa automat in modulele care importa modulul asta
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
