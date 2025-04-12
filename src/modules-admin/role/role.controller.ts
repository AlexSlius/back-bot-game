import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }
}
