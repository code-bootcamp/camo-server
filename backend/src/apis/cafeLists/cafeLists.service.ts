import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeListImage } from '../cafeListImage/entities/cafeListImage.entity';
import { CafeListTag } from '../cafeListTags/entities/cafeListTag.entity';
import { CafeList } from './entities/cafeList.entity';

@Injectable()
export class CafeListsService {
  constructor(
    @InjectRepository(CafeList)
    private readonly cafeListRepository: Repository<CafeList>,
    @InjectRepository(CafeListImage)
    private readonly cafeListImageRepository: Repository<CafeListImage>,
    @InjectRepository(CafeListTag)
    private readonly cafeListTagRepository: Repository<CafeListTag>,
  ) {}

  async findOne({ cafeListId }) {
    const result = await this.cafeListRepository.findOne({
      where: { id: cafeListId },
      relations: ['cafeListImage', 'reviews', 'cafeListTag'],
    });
    return result;
    // 12개 기준
  }

  async findByCreatedAt({ page, sortBy }) {
    return await this.cafeListRepository.find({
      relations: ['cafeListImage', 'reviews', 'cafeListTag'],
      order: { createdAt: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findByfavoriteCafeCount({ page, sortBy }) {
    return await this.cafeListRepository.find({
      relations: ['cafeListImage', 'reviews', 'cafeListTag'],
      order: { favoriteCafeCount: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findAll({ page }) {
    const result = await this.cafeListRepository.find({
      relations: ['cafeListImage', 'reviews', 'cafeListTag'],
      take: 10,
      skip: (page - 1) * 10,
    });
    return result;
  }

  async create({ userId, createCafeListInput }) {
    const { tags, images, ...cafeList } = createCafeListInput;

    const cafeListTag = [];
    for (let i = 0; i < tags.length; i++) {
      const tagName = tags[i].replace('#', '');

      const prevTag = await this.cafeListTagRepository.findOne({
        where: { name: tagName },
      });

      if (prevTag) {
        cafeListTag.push(prevTag);
      } else {
        const newTag = await this.cafeListTagRepository.save({
          name: tagName,
        });
        cafeListTag.push(newTag);
      }
    }
    const result = await this.cafeListRepository.save({
      ...cafeList,
      cafeListTag: cafeListTag,
      user: userId,
    });

    console.log('여기까지 확인2');
    if (images) {
      await Promise.all(
        images.map(
          (el) =>
            new Promise((resolve, reject) => {
              this.cafeListImageRepository.save({
                url: el,
                cafeList: { id: result.id },
              });
              resolve('이미지 저장 완료');
              reject('이미지 저장 실패');
            }),
        ),
      );
    }

    return result;
  }

  async update({ userId, cafeListId, updateCafeListInput }) {
    const { image, ...updatecafeList } = updateCafeListInput;

    const newCafeList = await this.cafeListRepository.findOne({
      where: { id: cafeListId },
      relations: ['user'],
    });
    if (userId !== newCafeList.user.id)
      throw new ConflictException('권한이 없습니다.');

    const _image = await this.cafeListImageRepository.find({
      where: { id: cafeListId },
    });
    await Promise.all(
      _image.map(
        (el) =>
          new Promise((resolve) => {
            this.cafeListImageRepository.softDelete({ id: el.id });
            resolve('이미지 삭제 완료');
          }),
      ),
    );

    await Promise.all(
      _image.map(
        (el) =>
          new Promise((resolve) => {
            this.cafeListImageRepository.save({
              url: el.url,
              cafeList: { id: cafeListId },
            });
            resolve('이미지 저장 완료');
          }),
      ),
    );

    const result = this.cafeListRepository.save({
      ...newCafeList,
      ...updatecafeList,
    });
    return result;
  }

  async delete({ userId, cafeListId }) {
    const cafeList = await this.cafeListRepository.findOne({
      where: { id: cafeListId },
      relations: ['user'],
    });
    if (cafeList.user.id !== userId)
      throw new ConflictException('삭제 권한이 없습니다.');

    const result = await this.cafeListRepository.softDelete({ id: cafeListId });
    return result.affected ? true : false;
  }

  async restore({ cafeListId }) {
    const restoreResult = await this.cafeListRepository.restore({
      id: cafeListId,
    });
    return restoreResult.affected ? true : false;
  }
}
