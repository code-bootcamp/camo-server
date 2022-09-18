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
  async createImage({ image, board }) {
    const result = await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve) => {
            const results = this.ImagesRepository.save({
              isMain: idx === 0 ? true : false,
              url: el,
              board,
            });
            resolve(results);
          }),
      ),
    );
    console.log(result);
    return result;
  }

  async updateImage({ image, board }) {
    await this.ImagesRepository.delete({
      board: { id: board.id },
    });

    const result = await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve) => {
            const result = this.ImagesRepository.save({
              isMain: idx === 0 ? true : false,
              url: el,
              board: board,
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
