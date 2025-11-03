// server/src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User, Role } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // תיקון: עדכן את סוג ההחזרה
  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
  // 1. בדוק אם המשתמש כבר קיים
  const existingUser = await this.usersService.findOneByEmail(registerDto.email);
  if (existingUser) {
    throw new ConflictException('משתמש עם אימייל זה כבר קיים');
  }

  // 2. בדוק כמה משתמשים קיימים כדי לקבוע את התפקיד
  const userCount = await this.usersService.countUsers();
  const role = userCount === 0 ? Role.Admin : Role.User;

  // 3. צור את המשתמש החדש עם התפקיד שנקבע
  const user = await this.usersService.create(
    registerDto.email,
    registerDto.password,
    role, // <-- העברת התפקיד
  );

  const { password, ...result } = user.toObject();
  return result;
}
  async validateUser(email: string, pass: string): Promise<any> {
    // ה- 'user' כאן הוא עכשיו UserDocument ויש לו .toObject()
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    
    throw new UnauthorizedException('אימייל או סיסמה שגויים');
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user._id,
      role: user.role,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}