import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Board } from '../boards/entities/board.entity';
import { CafeList } from '../cafeLists/entities/cafeList.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { FavoriteCafe } from './entities/favoriteCafe.entity';

@Injectable()
export class FavoriteCafesService {
  constructor(
    @InjectRepository(FavoriteCafe)
    private readonly favoriteCafeRepository: Repository<FavoriteCafe>,

    @InjectRepository(CafeList)
    private readonly cafeListRepository: Repository<CafeList>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,

    private readonly usersService: UsersService,
  ) {}

  async like({ userId, cafeListId }): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      const cafeList = await queryRunner.manager.findOne(CafeList, {
        where: { id: cafeListId },
      });

      if (!cafeList) throw new NotFoundException('존재하지 않는 피드입니다');

      const cafeLike = await this.favoriteCafeRepository
        .createQueryBuilder('cafeLike')
        .leftJoin('cafeLike.user', 'user')
        .leftJoin('cafeLike.cafeList', 'cafeList')
        .where({ user })
        .andWhere({ cafeList })
        .getOne();

      let updateLike: FavoriteCafe;
      let updateCafeList: CafeList;
      let likeStatus: boolean = null;

      if (!cafeLike?.isLike || !cafeLike) {
        // case 1.좋아요를 누르지 않은 상태
        // case 2.좋아요 관계가 형성되어있지 않은 상태
        // 좋아요 상태를 true로 변경하고 피드의 좋아요 수를 증가시킵니다
        updateLike = this.favoriteCafeRepository.create({
          ...cafeLike,
          user,
          cafeList,
          isLike: true,
        });

        updateCafeList = this.cafeListRepository.create({
          ...cafeList,
          favoriteCafeCount: cafeList.favoriteCafeCount + 1,
        });

        likeStatus = true;
      } else if (cafeLike?.isLike) {
        // case 3. 이미 좋아요를 누른 상태
        // 좋아요 취소로 간주합니다
        // 좋아요 상태를 false로 변경하고 피드의 좋아요 수를 감소시킵니다
        updateLike = this.favoriteCafeRepository.create({
          ...cafeLike,
          user,
          cafeList,
          isLike: false,
        });

        updateCafeList = this.cafeListRepository.create({
          ...cafeList,
          favoriteCafeCount: cafeList.favoriteCafeCount - 1,
        });

        likeStatus = false;
        await this.favoriteCafeRepository.delete({
          cafeList: cafeListId,
          user: userId,
        });
      }

      if (likeStatus === null)
        throw new NotAcceptableException('좋아요 토글에 실패했습니다');

      await queryRunner.manager.save(updateLike);
      await queryRunner.manager.save(updateCafeList);
      await queryRunner.commitTransaction();

      return likeStatus;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findLike({ boardId }) {
    const board = await this.cafeListRepository.find({
      where: { id: boardId },
    });
    return board[0];
  }

  async findByUserId({ userId }) {
    const result = await this.favoriteCafeRepository.find({
      where: { user: { id: userId } },
    });
    return result.length;
  }

  async findAll({ cafeListId }) {
    const user = await this.favoriteCafeRepository.find({
      where: { cafeList: { id: cafeListId } },
      relations: ['cafeList', 'user'],
    });
    console.log(user);
  }

  async findUserLike({ userId, page }) {
    return await this.favoriteCafeRepository.find({
      where: { user: { id: userId } },
      relations: ['cafeList', 'user', 'cafeList.cafeListImage'],
      take: 6,
      skip: page ? (page - 1) * 6 : 0,
    });
  }
}
