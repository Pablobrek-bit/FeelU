import { Module } from '@nestjs/common';
import { ViewService } from '../application/service/view.service';
import { ViewRepository } from '../application/ports/view.repository';
import { PrismaViewRepository } from '../infrastructure/persistence/repository/prisma-view.repository';

@Module({
  providers: [
    ViewService,
    { provide: ViewRepository, useClass: PrismaViewRepository },
  ],
  exports: [ViewService, ViewRepository],
})
export class ViewModule {}
