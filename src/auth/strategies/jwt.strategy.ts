// server/src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // ודא שזה מיובא

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) { // הזרקה
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      
      // --- התיקון כאן ---
      // השתמש ב-getOrThrow כדי להבטיח שהערך הוא string
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // הפונקציה הזו מופעלת אוטומטית אחרי שהטוקן מאומת בהצלחה
  // היא מחזירה את המידע מהטוקן ומצרפת אותו ל-request.user
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}