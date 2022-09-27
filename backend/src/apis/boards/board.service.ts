import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../users/entites/user.entity';
import { Board } from './entities/board.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ImagesService } from '../images/image.service';
import { UpdateBoardInput } from './dto/updateBoard.input';

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
    private readonly imagesService: ImagesService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll({ page }: { page: number }): Promise<Board[]> {
    return await this.boardRepository.find({
      relations: ['tags', 'comment', 'images', 'user'],
      order: { createdAt: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardByUser({ userId }: { userId: string }): Promise<number> {
    const result = await this.boardRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return result.length;
  }

  async findBoardByUserWithPage({
    userId,
    page,
  }: {
    userId: string;
    page: number;
  }): Promise<Board[]> {
    const result = await this.boardRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
      take: 3,
      skip: page ? (page - 1) * 3 : 0,
    });
    return result;
  }

  async findBoardsCreatedAt({ page, sortBy }): Promise<Board[]> {
    return await this.boardRepository.find({
      relations: ['tags', 'comment', 'images', 'user', 'favoriteBoard'],
      order: { createdAt: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardsLikeCount({ page, sortBy }): Promise<Board[]> {
    return await this.boardRepository.find({
      relations: ['tags', 'comment', 'images', 'user', 'favoriteBoard'],
      order: { likeCount: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardOne({ boardId }: { boardId: string }): Promise<Board> {
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
        await this.imagesService.createImage({ image, result });
      }
      return result;
    } else {
      const result = await this.boardRepository.save({
        ...Board,
        user: _user,
      });
      if (image) {
        await this.imagesService.createImage({ image, result });
      }
      return result;
    }
  }

  async update({ boardId, updateBoardInput }) {
    const { image } = updateBoardInput;

    const boardList = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['user'],
    });

    const _image = await this.imageRepository.find({
      where: { board: { id: boardId } },
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
      image.map(
        (el) =>
          new Promise((resolve) => {
            this.imageRepository.save({
              url: el,
              board: { id: boardList.id },
            });
            resolve('이미지 저장 완료');
          }),
      ),
    );

    const result = this.boardRepository.save({
      ...boardList,
      ...updateBoardInput,
    });
    return result;
  }

  async delete({ boardId }): Promise<boolean> {
    const deleteresult = await this.boardRepository.softDelete({
      id: boardId,
    });
    return deleteresult.affected ? true : false;
  }

  async WithBoardDelete(): Promise<Board[]> {
    return await this.boardRepository.find({
      relations: ['boardTag', 'favoritBoard', 'Comment'],
      withDeleted: true,
    });
  }

  async restore({ boardId }): Promise<boolean> {
    const restoreResult = await this.boardRepository.restore({ id: boardId });
    return restoreResult.affected ? true : false;
  }

  async search({ search_board }) {
    const checkRedis = await this.cacheManager.get(search_board);
    if (checkRedis) {
      return checkRedis;
    } else {
      const result = await this.elasticsearchService.search({
        index: 'board',
        size: 10000,
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
          id: el['_id'],
          title: el._source['title'],
          contents: el._source['contents'],
        };
        return obj;
      });

      await this.cacheManager.set(search_board, arrayBoard, { ttl: 1 });
      return arrayBoard;
    }
  }

  /** 게시글 내용 검색 */
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

  /** 게시글 수정 */
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
