var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../core/auth/auth.module.js';
import { Customer } from '../../database/entities/customer.entity.js';
import { CustomerController } from './customer.controller.js';
import { CustomerService } from './customer.service.js';
let CustomerModule = class CustomerModule {
};
CustomerModule = __decorate([
    Module({
        imports: [AuthModule, TypeOrmModule.forFeature([Customer])],
        controllers: [CustomerController],
        providers: [CustomerService],
        exports: [CustomerService],
    })
], CustomerModule);
export { CustomerModule };
//# sourceMappingURL=customer.module.js.map