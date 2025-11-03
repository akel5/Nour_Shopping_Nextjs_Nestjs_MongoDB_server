// server/src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_VERY_SECRET_KEY_12345', // חייב להיות זהה למה שב-auth.module!
    });
  }

  // הפונקציה הזו מופעלת אוטומטית אחרי שהטוקן מאומת בהצלחה
  // היא מחזירה את המידע מהטוקן ומצרפת אותו ל-request.user
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}