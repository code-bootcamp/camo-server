import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeListImage } from './entities/cafeListImage.entity';

@Injectable()
export class CafeListImagesService {
  constructor(
    @InjectRepository(CafeListImage)
    private readonly cafeListImagesRepository: Repository<CafeListImage>,
  ) {}
  async createImage({ image, result }) {
    return await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve, reject) => {
            this.cafeListImagesRepository.save({
              isMain: idx === 0 ? true : false,
              url: el,
              cafeList: { id: result.id },
            });
            resolve('이미지 저장 완료');
            reject('이미지 저장 실패');
          }),
      ),
    );
  }

  async updateImage({ image, cafeList }): Promise<string[]> {
    await this.cafeListImagesRepository.find({
      where: { cafeList: { id: cafeList.id } },
    });

    await this.cafeListImagesRepository.delete({
      cafeList: { id: cafeList.id },
    });

    const result = await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve) => {
            const result = this.cafeListImagesRepository.save({
              isMain: idx === 0 ? true : false,
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
