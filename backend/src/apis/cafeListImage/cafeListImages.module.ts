import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeListImageResolver } from './CafeListImages.resolver';
import { CafeListImagesService } from './CafeListImages.service';
import { CafeListImage } from './entities/cafeListImage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeListImage, //
    ]),
  ],
  providers: [
    CafeListImageResolver, //
    CafeListImagesService,
  ],
})
export class CafeListImageModule {}
