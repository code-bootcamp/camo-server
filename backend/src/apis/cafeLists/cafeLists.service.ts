import { CafeListTag } from '../cafeListTags/entities/cafeListTag.entity';
import { CafeList } from './entities/cafeList.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeListImage } from '../cafeListImage/entities/cafeListImage.entity';

@Injectable()
export class CafeListsService {
  constructor(
    @InjectRepository(CafeList)
    private readonly cafeListRepository: Repository<CafeList>,

    @InjectRepository(CafeListImage)
    private readonly cafeListImageRepository: Repository<CafeListImage>,

    @InjectRepository(CafeListTag)
    private readonly cafeListTagRepository: Repository<CafeListTag>,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findOne({ cafeListId }) {
    const result = await this.cafeListRepository.findOne({
      where: { id: cafeListId },
      relations: [
        'cafeListImage',
        'reviews',
        'cafeListTag',
        'user',
        'cafeReservation',
      ],
    });
    return result;
    // 12개 기준
  }

  async findByCreatedAt({ page, sortBy }) {
    return await this.cafeListRepository.find({
      relations: [
        'cafeListImage',
        'reviews',
        'cafeListTag',
        'user',
        'cafeReservation',
      ],
      order: { createdAt: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findByfavoriteCafeCount({ page, sortBy }) {
    return await this.cafeListRepository.find({
      relations: [
        'cafeListImage',
        'reviews',
        'cafeListTag',
        'user',
        'cafeReservation',
      ],
      order: { favoriteCafeCount: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findAll({ page }) {
    const result = await this.cafeListRepository.find({
      relations: [
        'cafeListImage',
        'reviews',
        'cafeListTag',
        'user',
        'cafeReservation',
      ],
      take: 10,
      skip: (page - 1) * 10,
    });
    return result;
  }

  async create({ userId, createCafeListInput }) {
    const { tags, images, ...cafeList } = createCafeListInput;

    if (tags) {
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
      if (images) {
        const imageresult = await Promise.all(
          images.map(
            (el, idx) =>
              new Promise((resolve, reject) => {
                this.cafeListImageRepository.save({
                  isMain: idx === 0 ? true : false,
                  url: el,
                  cafeList: { id: result.id },
                });
                resolve('이미지 저장 완료');
                reject('이미지 저장 실패');
              }),
          ),
        );
        console.log('123412341234', imageresult);
      }
      return result;
    } else {
      const result = await this.cafeListRepository.save({
        ...cafeList,
        user: userId,
      });
      if (images) {
        await Promise.all(
          images.map(
            (el, idx) =>
              new Promise((resolve, reject) => {
                this.cafeListImageRepository.save({
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
      return result;
    }
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

  async delete({ context, cafeListId }) {
    const userId = context.req.user.id;
    const cafeList = await this.cafeListRepository.findOne({
      where: { id: cafeListId },
      relations: ['user'],
    });
    // if (cafeList.user.id !== userId)
    //   throw new ConflictException('게시물의 작성자만 삭제할 수 있습니다.');

    const result = await this.cafeListRepository.softDelete({ id: cafeListId });
    this.cafeListImageRepository.delete({ cafeList: { id: cafeList.id } });
    return result.affected ? true : false;
  }

  async restore({ cafeListId }) {
    const restoreResult = await this.cafeListRepository.restore({
      id: cafeListId,
    });
    return restoreResult.affected ? true : false;
  }

  async saveImage({ images, result }) {
    await Promise.all(
      images.map(
        (el, idx) =>
          new Promise((resolve, reject) => {
            this.cafeListImageRepository.save({
              iaMain: idx === 0 ? true : false,
              url: el,
              cafeList: { id: result.id },
            });
            resolve('이미지 저장 완료');
            reject('이미지 저장 실패');
          }),
      ),
    );
  }

  async search({ search_cafelist }) {
    const checkRedis = await this.cacheManager.get(search_cafelist);
    if (checkRedis) {
      return checkRedis;
    } else {
      const result = await this.elasticsearchService.search({
        index: 'search-cafelist',
        body: {
          query: {
            multi_match: {
              query: search_cafelist,
              fields: ['title', 'contents', 'address'],
            },
          },
        },
      });
      const arrayCafeList = result.hits.hits.map((el) => {
        const obj = {
          id: el._source['_id'],
          title: el._source['title'],
          contents: el._source['contents'],
          address: el._source['address'],
        };
        return obj;
      });
      await this.cacheManager.set(search_cafelist, arrayCafeList, { ttl: 20 });
      return arrayCafeList;
    }
  }
}
