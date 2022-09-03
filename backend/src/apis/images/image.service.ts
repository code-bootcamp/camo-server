import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly ImagesRepository: Repository<Image>,
  ) {}
  async createImage({ image, board }) {
    const result = await Promise.all(
      image.map(
        (el) =>
          new Promise((resolve) => {
            const results = this.ImagesRepository.save({
              url: el,
              board,
            });
            resolve(results);
          }),
      ),
    );
    return result;
  }

  async updateImage({ image, board }) {
    const findBoardId = await this.ImagesRepository.find({
      where: { board: { id: board.id } },
    });

    await this.ImagesRepository.delete({
      board: { id: board.id },
    });

    const result = await Promise.all(
      image.map(
        (el) =>
          new Promise((resolve) => {
            const result = this.ImagesRepository.save({
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
