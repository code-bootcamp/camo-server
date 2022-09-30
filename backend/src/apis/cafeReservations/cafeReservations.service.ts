import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';
import { CafeReservation } from './entities/cafeReservations.entity';

@Injectable()
export class CafeReservationsService {
  constructor(
    @InjectRepository(CafeReservation)
    private readonly cafeReservationsRepository: Repository<CafeReservation>,

    @InjectRepository(CafeBoard)
    private readonly cafeListsRepository: Repository<CafeBoard>,
  ) {}

  async find({ cafeReservationId }): Promise<CafeReservation> {
    return await this.cafeReservationsRepository.findOne({
      where: { id: cafeReservationId },
      relations: ['cafeList', 'user'],
    });
  }

  async findbyUser({ userId }): Promise<number> {
    const result = await this.cafeReservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['cafeList', 'user'],
    });
    return result.length;
  }

  async findUser({
    page,
    userId,
  }: {
    page: number;
    userId: string;
  }): Promise<CafeReservation[]> {
    return await this.cafeReservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['cafeList', 'user', 'cafeList.cafeListImage'],
      take: 2,
      skip: page ? (page - 1) * 2 : 0,
    });
  }

  async create({ createReservationInput }): Promise<CafeReservation[]> {
    const { userId, cafeBoardId } = createReservationInput;

    const cafeList = await this.cafeListsRepository.findOne({
      where: { id: cafeBoardId },
    });

    const result = await this.cafeReservationsRepository.save({
      ...createReservationInput,
      title: cafeList.title,
      deposit: cafeList.deposit,
      user: userId,
      cafeList: cafeBoardId,
    });
    return result;
  }
}
