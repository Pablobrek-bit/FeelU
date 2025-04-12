import { Module } from '@nestjs/common';
import { SwipeController } from '../infrastructure/controller/swipe.controller';
import { SwipeService } from '../application/service/swipe.service';
import { UserModule } from './user.module';
import { ViewModule } from './view.module';
import { MatchModule } from './match.module';
import { LikeModule } from './like.module';

@Module({
  controllers: [SwipeController],
  providers: [SwipeService],
  exports: [SwipeService],
  imports: [UserModule, ViewModule, MatchModule, LikeModule],
})
export class SwipeModule {}
