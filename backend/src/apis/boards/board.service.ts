import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../users/entites/user.entity';
import { Board } from './entities/board.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async findBoardAll({ page }) {
    return await this.boardRepository.find({
      relations: ['tags', 'comment', 'images', 'user'],
      order: { createdAt: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardByUser({ userId }) {
    const result = await this.boardRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return result.length;
  }

  async findBoardByUserWithPage({ userId, page }) {
    const result = await this.boardRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
      take: 3,
      skip: page ? (page - 1) * 3 : 0,
    });
    console.log(result);
    return result;
  }

  async findBoardsCreatedAt({ page, sortBy }) {
    return await this.boardRepository.find({
      relations: ['tags', 'comment', 'images', 'user', 'favoriteBoard'],
      order: { createdAt: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardsLikeCount({ page, sortBy }) {
    return await this.boardRepository.find({
      relations: ['tags', 'comment', 'images', 'user', 'favoriteBoard'],
      order: { likeCount: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardOne({ boardId }) {
    const result = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['tags', 'comment', 'images', 'user', 'favoriteBoard'],
    });

    return result;
  }

  async create({ user, createBoardInput }) {
    const { tags, image, ...Board } = createBoardInput;

    const _user = await this.userRepository.findOne({
      where: { email: user },
    });
    if (tags) {
      const boardtag = [];
      for (let i = 0; i < tags.length; i++) {
        const tagName = tags[i].replace('#', '');

        const prevTag = await this.tagRepository.findOne({
          where: { name: tagName },
        });
        if (prevTag) {
          boardtag.push(prevTag);
        } else {
          const newTag = await this.tagRepository.save({
            name: tagName,
          });
          boardtag.push(newTag);
        }
      }
      const result = await this.boardRepository.save({
        ...Board,
        tags: boardtag,
        user: _user.id,
      });

      if (image) {
        const imageResult = await Promise.all(
          image.map(
            (el, idx) =>
              new Promise((resolve, reject) => {
                this.imageRepository.save({
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
      return result;
    } else {
      const result = await this.boardRepository.save({
        ...Board,
        user: _user,
      });
      if (image) {
        const imageResult = await Promise.all(
          image.map(
            (el, idx) =>
              new Promise((resolve, reject) => {
                this.imageRepository.save({
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
      return result;
    }
  }

  async update({ boardId, updateBoardInput }) {
    const { image, ...Board } = updateBoardInput;

    const boardList = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    const _image = await this.imageRepository.find({
      where: { id: Board.id },
    });

    await Promise.all(
      _image.map(
        (el) =>
          new Promise((resolve) => {
            this.imageRepository.softDelete({ id: el.id });
            resolve('이미지 삭제 완료');
          }),
      ),
    );

    await Promise.all(
      _image.map(
        (el) =>
          new Promise((resolve) => {
            this.imageRepository.save({
              url: el.url,
              board: { id: boardList.id },
            });
            resolve('이미지 저장 완료');
          }),
      ),
    );

    const result = this.boardRepository.save({
      ...boardList,
      id: boardId,
      ...updateBoardInput,
    });
    return result;
  }

  async delete({ boardId }) {
    const deleteresult = await this.boardRepository.softDelete({
      id: boardId,
    });
    return deleteresult.affected ? true : false;
  }

  async WithBoardDelete() {
    return await this.boardRepository.find({
      relations: ['boardTag', 'favoritBoard', 'Comment'],
      withDeleted: true,
    });
  }

  async restore({ boardId }) {
    const restoreResult = await this.boardRepository.restore({ id: boardId });
    return restoreResult.affected ? true : false;
  }

  async search({ search_board }) {
    const checkRedis = await this.cacheManager.get(search_board);
    if (checkRedis) {
      return checkRedis;
    } else {
      const result = await this.elasticsearchService.search({
        index: 'search-board',
        body: {
          query: {
            multi_match: {
              query: search_board,
              fields: ['title', 'contents'],
            },
          },
        },
      });

      const arrayBoard = result.hits.hits.map((el) => {
        const obj = {
          id: el._source['id'],
          title: el._source['title'],
          contents: el._source['contents'],
        };
        return obj;
      });

      await this.cacheManager.set(search_board, arrayBoard, { ttl: 20 });

      return arrayBoard;
    }
  }

  async searchUsersBoard({ search }) {
    const checkRedis = await this.cacheManager.get(search);

    if (checkRedis) {
      return checkRedis;
    } else {
      const result = await this.elasticsearchService.search({
        index: 'search-board',
        body: {
          query: {
            multi_match: {
              query: search,
              fields: ['title', 'contents'],
            },
          },
        },
      });

      const arrayBoard = result.hits.hits.map((el) => {
        const obj = {
          id: el._source['id'],
          title: el._source['title'],
          contents: el._source['contents'],
        };
        return obj;
      });

      await this.cacheManager.set(search, arrayBoard, { ttl: 20 });

      return arrayBoard;
    }
  }

  async updateBoard({ boardId, nickName, updateBoardInput, context }) {
    const board = await this.findBoardOne({ boardId });
    const user = context.req.user.id;

    if (!board)
      throw new UnprocessableEntityException('등록된 게시글이 없습니다.');

    if (!user)
      throw new ConflictException(`${nickName}님의 게시글이 아닙니다.`);

    return this.update({ boardId, updateBoardInput });
  }
}
