import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeListImage } from './entities/cafeListImage';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeListImage, //
    ]),
  ],
  providers: [
    //
  ],
})
export class CafeListImageModule {}
