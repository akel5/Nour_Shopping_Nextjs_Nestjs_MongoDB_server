// server/src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // כאן אנו מגדירים ששם המשתמש יהיה שדה ה"אימייל"
    super({ usernameField: 'email' });
  }

  // Passport יקרא לפונקציה זו אוטומטית כשאנו משתמשים ב-AuthGuard('local')
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('אימייל או סיסמה שגויים');
    }
    return user;
  }
}