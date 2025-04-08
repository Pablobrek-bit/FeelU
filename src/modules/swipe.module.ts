import { Module } from '@nestjs/common';
import { SwipeController } from '../infrastructure/controller/swipe.controller';
import { SwipeService } from '../application/service/swipe.service';
import { SwipeRepository } from '../application/ports/swipe.repository';
import { PrismaSwipeRepository } from '../infrastructure/persistence/repository/prisma-swipe.repository';
import { UserModule } from './user.module';

@Module({
  controllers: [SwipeController],
  providers: [
    SwipeService,
    { provide: SwipeRepository, useClass: PrismaSwipeRepository },
  ],
  exports: [SwipeService, SwipeRepository],
  imports: [UserModule],
})
export class SwipeModule {}
