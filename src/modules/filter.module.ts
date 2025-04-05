import { Module } from '@nestjs/common';
import { FilterService } from '../application/service/filter.service';
import { PrismaService } from '../infrastructure/config/prisma.service';
import { FilterRepository } from '../application/ports/filter.repository';
import { PrismaFilterRepository } from '../infrastructure/persistence/repository/prisma-filter.repository';

@Module({
  providers: [
    FilterService,
    PrismaService,
    { provide: FilterRepository, useClass: PrismaFilterRepository },
  ],
  exports: [FilterService, FilterRepository],
})
export class FilterModule {}
