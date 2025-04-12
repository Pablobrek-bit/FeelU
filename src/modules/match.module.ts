import { Module } from '@nestjs/common';
import { MatchService } from '../application/service/match.service';
import { MatchRepository } from '../application/ports/match.repository';
import { PrismaMatchRepository } from '../infrastructure/persistence/repository/prisma-match.repository';

@Module({
  providers: [
    MatchService,
    { provide: MatchRepository, useClass: PrismaMatchRepository },
  ],
  exports: [MatchService, MatchRepository],
})
export class MatchModule {}
