import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly ImagesRepository: Repository<Image>, //
  ) {}
  async createImage({ image, result }) {
    return await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve, reject) => {
            this.ImagesRepository.save({
              isMain: idx === 0 ? true : false,
              url: el,
              board: { id: result.id },
            });
            resolve('이미지 저장 완료');
            reject('이미지 저장 실패');
          }),
      ),
    );
  }

  async updateImage({ image, freeBoard }) {
    await this.ImagesRepository.delete({
      freeBoard: { id: freeBoard.id },
    });

    const result = await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve) => {
            const result = this.ImagesRepository.save({
              isMain: idx === 0 ? true : false,
              url: el,
              freeBoard: freeBoard,
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
