import { CafeListTag } from '../cafeListTags/entities/cafeListTag.entity';
import { CafeBoard } from './entities/cafeBoard.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entites/user.entity';
import { Like } from '../likes/entities/like.entity';
import { ImagesService } from '../images/image.service';
import { Image } from '../images/entities/image.entity';

@Injectable()
export class CafeBoardsService {
  constructor(
    @InjectRepository(CafeBoard)
    private readonly cafeBoardsRepository: Repository<CafeBoard>,

    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,

    private readonly imagesService: ImagesService,

    @InjectRepository(CafeListTag)
    private readonly cafeListTagRepository: Repository<CafeListTag>,

    private readonly elasticsearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne({ cafeBoardId }: { cafeBoardId: string }): Promise<CafeBoard> {
    const result = await this.cafeBoardsRepository.findOne({
      where: { id: cafeBoardId },
      relations: [
        'images',
        'reviews',
        'cafeListTag',
        'user',
        'cafeReservation',
      ],
    });
    return result;
  }

  async findByCreatedAt({ page, sortBy }): Promise<CafeBoard[]> {
    return await this.cafeBoardsRepository.find({
      relations: [
        'images',
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
    return await this.cafeBoardsRepository.find({
      relations: [
        'images',
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

  async findAll({ page }: { page: number }): Promise<CafeBoard[]> {
    const result = await this.cafeBoardsRepository.find({
      relations: [
        'images',
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

  async create({ userId, createCafeBoardInput }): Promise<CafeBoard[]> {
    const { tags, image, ...cafeBoard } = createCafeBoardInput;

    const _user = await this.usersRepository.findOne({
      where: { id: userId },
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
      const result = await this.cafeBoardsRepository.save({
        ...cafeBoard,
        cafeListTag: cafeListTag,
        user: _user.id,
      });
      if (image) {
        await this.imagesService.createCafeBoardImage({ image, result });
      }
      return result;
    } else {
      const result = await this.cafeBoardsRepository.save({
        ...cafeBoard,
        user: _user,
      });
      if (image) {
        await this.imagesService.createCafeBoardImage({ image, result });
      }
      return result;
    }
  }

  async update({
    userEmail,
    cafeBoardId,
    updateCafeBoardInput,
  }): Promise<CafeBoard[]> {
    const { image, ...updateCafeBoard } = updateCafeBoardInput;

    const myCafeBoard = await this.cafeBoardsRepository.findOne({
      where: { id: cafeBoardId },
      relations: ['user'],
    });

    if (userEmail !== myCafeBoard.user.email)
      throw new ConflictException('권한이 없습니다.');

    const _image = await this.imagesRepository.find({
      where: { cafeBoard: { id: cafeBoardId } },
    });

    await Promise.all(
      _image.map(
        (el) =>
          new Promise((resolve) => {
            this.imagesRepository.softDelete({ id: el.id });
            resolve('이미지 삭제 완료');
          }),
      ),
    );

    await Promise.all(
      image.map(
        (el) =>
          new Promise((resolve) => {
            this.imagesRepository.save({
              url: el,
              cafeBoard: { id: myCafeBoard.id },
            });
            resolve('이미지 저장 완료');
          }),
      ),
    );

    const result = this.cafeBoardsRepository.save({
      ...myCafeBoard,
      ...updateCafeBoardInput,
    });
    return result;
  }

  async delete({ context, cafeBoardId }): Promise<boolean> {
    const userId = context.req.user.id;
    const cafeBoard = await this.cafeBoardsRepository.findOne({
      where: { id: cafeBoardId },
      relations: ['user'],
    });
    // if (cafeBoard.user.id !== userId)
    //   throw new ConflictException('게시물의 작성자만 삭제할 수 있습니다.');

    const result = await this.cafeBoardsRepository.softDelete({
      id: cafeBoardId,
    });
    this.imagesRepository.delete({ cafeBoard: { id: cafeBoard.id } });
    this.likesRepository.delete({ cafeBoard: { id: cafeBoard.id } });
    return result.affected ? true : false;
  }

  async restore({ cafeBoardId }): Promise<boolean> {
    const restoreResult = await this.cafeBoardsRepository.restore({
      id: cafeBoardId,
    });
    return restoreResult.affected ? true : false;
  }

  async saveImage({ images, result }) {
    await Promise.all(
      images.map(
        (el, idx) =>
          new Promise((resolve, reject) => {
            this.imagesRepository.save({
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
