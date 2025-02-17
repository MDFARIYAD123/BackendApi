import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MicrosoftStrategy } from './microsoft.strategy';
import { EmailService } from './email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to access its values
      inject: [ConfigService], // Inject ConfigService to access environment variables
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'), // Get secretKey from .env
        signOptions: { expiresIn: '1h' }, // You can keep this fixed or load from env as well
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy, MicrosoftStrategy, EmailService],
  controllers: [AuthController],
  exports: [EmailService]
})
export class AuthModule { }


