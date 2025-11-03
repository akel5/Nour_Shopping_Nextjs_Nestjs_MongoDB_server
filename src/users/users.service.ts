// server/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, Role  } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // תיקון: שנה את סוג ההחזרה ל-UserDocument
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async countUsers(): Promise<number> {
  return this.userModel.countDocuments().exec();
}

  async create(email: string, password: string, role: Role): Promise<UserDocument> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new this.userModel({
    email,
    password: hashedPassword,
    role: role, // <-- הוספנו את השדה הזה
  });

  return newUser.save();
}
async findAll(): Promise<User[]> {
  return this.userModel.find().select('-password').exec(); // מחזיר הכל חוץ מהסיסמה
}

async updateRole(id: string, role: Role): Promise<User | null> {
  return this.userModel.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
}

async deleteUser(id: string): Promise<any> {
  return this.userModel.findByIdAndDelete(id);
}
}