import { Module } from '@nestjs/common';
import { ProfileService } from '../application/service/profile.service';
import { ProfileRepository } from '../application/ports/profile.repository';
import { PrismaProfileRepository } from '../infrastructure/persistence/repository/prisma-profile.repository';

@Module({
  providers: [
    ProfileService,
    { provide: ProfileRepository, useClass: PrismaProfileRepository },
  ],
  exports: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
