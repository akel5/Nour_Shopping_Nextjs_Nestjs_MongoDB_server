// server/src/users/users.controller.ts
import { Controller, Get, UseGuards, Delete, Param, Patch, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './schemas/user.schema';
import { UsersService } from './users.service';

// הגדרת כל הנתיבים בקונטרולר הזה כדורשים אימות (טוקן) והרשאת אדמין
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // PATCH /users/:id/role
  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.usersService.updateRole(id, role);
  }

  // DELETE /users/:id
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}