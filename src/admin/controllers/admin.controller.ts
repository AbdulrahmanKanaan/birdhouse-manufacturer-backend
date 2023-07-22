import { Controller, Get, Post } from '@nestjs/common';
import { AdminService } from '../services';
import { Birdhouse } from '&/domain/entities';

@Controller('/')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/')
  async getHello(): Promise<Birdhouse[]> {
    return this.adminService.listBirdhouses();
  }

  @Post('/')
  async createBirdhouse(): Promise<void> {
    // return await this.adminService.createBirdhouse();
  }
}
