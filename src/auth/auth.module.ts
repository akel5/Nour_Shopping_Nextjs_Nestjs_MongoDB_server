// server/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy'; // <-- ייבוא חדש
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({ // שינוי ל-registerAsync
      imports: [ConfigModule], // ייבוא מודול ההגדרות
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // קריאה ממשתנה סביבה
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService], // הזרקה של השירות
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy, // <-- הוספה של ה-Strategy
  ], 
})
export class AuthModule {}