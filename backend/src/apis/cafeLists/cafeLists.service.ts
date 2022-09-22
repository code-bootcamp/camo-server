import { CafeListTag } from '../cafeListTags/entities/cafeListTag.entity';
import { CafeList } from './entities/cafeList.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeListImage } from '../cafeListImage/entities/cafeListImage.entity';
import { FavoriteCafe } from '../favoreiteCafes/entities/favoriteCafe.entity';
import { CafeListImagesService } from '../cafeListImage/CafeListImages.service';
import { User } from '../users/entites/user.entity';

@Injectable()
export class CafeListsService {
  constructor(
    @InjectRepository(CafeList)
    private readonly cafeListRepository: Repository<CafeList>,

    @InjectRepository(CafeListImage)
    private readonly cafeListImageRepository: Repository<CafeListImage>,

    private readonly cafeListImageService: CafeListImagesService,

    @InjectRepository(CafeListTag)
    private readonly cafeListTagRepository: Repository<CafeListTag>,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(FavoriteCafe)
    private readonly favoriteCafeRepository: Repository<FavoriteCafe>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      take: 6,
      skip: page ? (page - 1) * 6 : 0,
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

  async create({ user, createCafeListInput }) {
    const { tags, image, ...cafeList } = createCafeListInput;

    const _user = await this.userRepository.findOne({
      where: { email: user },
    });

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
        user: _user.id,
      });
      if (image) {
        await this.cafeListImageService.createImage({ image, result });
      }
      return result;
    } else {
      const result = await this.cafeListRepository.save({
        ...cafeList,
        user: _user,
      });
      if (image) {
        await this.cafeListImageService.createImage({ image, result });
      }
      return result;
    }
  }

  async update({ userEmail, cafeListId, updateCafeListInput }) {
    const { image, ...updatecafeList } = updateCafeListInput;

    const myCafeList = await this.cafeListRepository.findOne({
      where: { id: cafeListId },
      relations: ['user'],
    });

    if (userEmail !== myCafeList.user.email)
      throw new ConflictException('권한이 없습니다.');

    const _image = await this.cafeListImageRepository.find({
      where: { cafeList: { id: cafeListId } },
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
      image.map(
        (el) =>
          new Promise((resolve) => {
            this.cafeListImageRepository.save({
              url: el,
              cafeList: { id: myCafeList.id },
            });
            resolve('이미지 저장 완료');
          }),
      ),
    );

    const result = this.cafeListRepository.save({
      ...myCafeList,
      ...updateCafeListInput,
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
    this.favoriteCafeRepository.delete({ cafeList: { id: cafeList.id } });
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
        index: 'cafelist',
        body: {
          query: {
            multi_match: {
              query: search_cafelist,
              fields: ['title', 'contents', 'address'],
            },
          },
        },
      });
      console.log(result);
      const arrayCafeList = result.hits.hits.map((el) => {
        const obj = {
          id: el['_id'],
          title: el._source['title'],
          contents: el._source['contents'],
          address: el._source['address'],
        };
        console.log(obj);
        return obj;
      });
      await this.cacheManager.set(search_cafelist, arrayCafeList, { ttl: 1 });
      return arrayCafeList;
    }
  }
}
