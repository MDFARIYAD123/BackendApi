import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
import { AuthModule } from './auth/auth.module';
import { Users } from './auth/users.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';

@Module({
  imports: [
    // ConfigModule for reading .env variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration], // Makes the configuration globally available
    }),

    // TypeOrmModule with database connection configured from environment variables
    TypeOrmModule.forRootAsync({

      imports: [ConfigModule],
      // Import ConfigModule to access its values
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 10, // Max 10 requests per window
          ttl: 60 * 1000, // Time window in milliseconds (1 minute)
        },
      ],

    }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard, // Enables throttling globally
  },],
})
export class AppModule { }





















// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { User } from './auth/user.entity';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       envFilePath: '.env',
//       isGlobal: true,
//     }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: 'Fariyad123@',
//       database: 'nestjs_dev_db',
//       entities: [User],
//       synchronize: true, // Set to false in production
//     }),
//     AuthModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule { }


