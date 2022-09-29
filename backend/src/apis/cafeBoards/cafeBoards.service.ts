import { CafeListTag } from '../cafeListTags/entities/cafeListTag.entity';
import { CafeBoard } from './entities/cafeBoard.entity';
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
export class CafeBoardsService {
  constructor(
    @InjectRepository(CafeBoard)
    private readonly cafeBoardRepository: Repository<CafeBoard>,

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

  async findOne({ cafeBoardId }): Promise<CafeBoard> {
    const result = await this.cafeBoardRepository.findOne({
      where: { id: cafeBoardId },
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

  async findByCreatedAt({ page, sortBy }): Promise<CafeBoard[]> {
    return await this.cafeBoardRepository.find({
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

  async findByfavoriteCafeCount({ page, sortBy }): Promise<CafeBoard[]> {
    return await this.cafeBoardRepository.find({
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

  async findAll({ page }): Promise<CafeBoard[]> {
    const result = await this.cafeBoardRepository.find({
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

  async create({ user, createCafeListInput }): Promise<CafeBoard[]> {
    const { tags, image, ...cafeBoard } = createCafeListInput;

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
      const result = await this.cafeBoardRepository.save({
        ...cafeBoard,
        cafeListTag: cafeListTag,
        user: _user.id,
      });
      if (image) {
        await this.cafeListImageService.createImage({ image, result });
      }
      return result;
    } else {
      const result = await this.cafeBoardRepository.save({
        ...cafeBoard,
        user: _user,
      });
      if (image) {
        await this.cafeListImageService.createImage({ image, result });
      }
      return result;
    }
  }

  async update({
    userEmail,
    cafeBoardId,
    updateCafeListInput,
  }): Promise<CafeBoard[]> {
    const { image, ...updatecafeList } = updateCafeListInput;

    const myCafeList = await this.cafeBoardRepository.findOne({
      where: { id: cafeBoardId },
      relations: ['user'],
    });

    if (userEmail !== myCafeList.user.email)
      throw new ConflictException('권한이 없습니다.');

    const _image = await this.cafeListImageRepository.find({
      where: { cafeBoard: { id: cafeBoardId } },
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
              cafeBoard: { id: myCafeList.id },
            });
            resolve('이미지 저장 완료');
          }),
      ),
    );

    const result = this.cafeBoardRepository.save({
      ...myCafeList,
      ...updateCafeListInput,
    });
    return result;
  }

  async delete({ context, cafeBoardId }): Promise<boolean> {
    const userId = context.req.user.id;
    const cafeBoard = await this.cafeBoardRepository.findOne({
      where: { id: cafeBoardId },
      relations: ['user'],
    });
    // if (cafeBoard.user.id !== userId)
    //   throw new ConflictException('게시물의 작성자만 삭제할 수 있습니다.');

    const result = await this.cafeBoardRepository.softDelete({
      id: cafeBoardId,
    });
    this.cafeListImageRepository.delete({ cafeBoard: { id: cafeBoard.id } });
    this.favoriteCafeRepository.delete({ cafeBoard: { id: cafeBoard.id } });
    return result.affected ? true : false;
  }

  async restore({ cafeBoardId }): Promise<boolean> {
    const restoreResult = await this.cafeBoardRepository.restore({
      id: cafeBoardId,
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
              cafeBoard: { id: result.id },
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
        index: 'cafeBoard',
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
        return obj;
      });
      await this.cacheManager.set(search_cafelist, arrayCafeList, { ttl: 5 });
      return arrayCafeList;
    }
  }
}
