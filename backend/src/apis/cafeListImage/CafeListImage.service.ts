import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeListImage } from './entities/cafeListImage';

@Injectable()
export class CafeListImagesService {
  constructor(
    @InjectRepository(CafeListImage)
    private readonly cafeListImagesRepository: Repository<CafeListImage>,
  ) {}
  async createImage({ image, board }) {
    const result = await Promise.all(
      image.map(
        (el) =>
          new Promise((resolve) => {
            const results = this.cafeListImagesRepository.save({
              url: el,
              board,
            });
            resolve(results);
          }),
      ),
    );
    return result;
  }

  async updateImage({ image, cafeList }) {
    const findCafeListId = await this.cafeListImagesRepository.find({
      where: { cafeList: { id: cafeList.id } },
    });

    await this.cafeListImagesRepository.delete({
      cafeList: { id: cafeList.id },
    });

    const result = await Promise.all(
      image.map(
        (el) =>
          new Promise((resolve) => {
            const result = this.cafeListImagesRepository.save({
              url: el,
              cafeList: cafeList,
            });
            resolve(result);
          }),
      ),
    );
    return result;
  }

  async findImageAll({ image }) {
    return image.map((el) => el.url);
  }
}
