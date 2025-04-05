import { Module } from '@nestjs/common';
import { ProfileService } from '../application/service/profile.service';
import { PrismaService } from '../infrastructure/config/prisma.service';
import { ProfileRepository } from '../application/ports/profile.repository';
import { PrismaProfileRepository } from '../infrastructure/persistence/repository/prisma-profile.repository';

@Module({
  providers: [
    ProfileService,
    PrismaService,
    { provide: ProfileRepository, useClass: PrismaProfileRepository },
  ],
  exports: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
