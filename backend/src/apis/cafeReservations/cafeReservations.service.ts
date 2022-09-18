import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeList } from '../cafeLists/entities/cafeList.entity';
import { CafeReservation } from './entities/cafeReservations.entity';

@Injectable()
export class CafeReservationsService {
  constructor(
    @InjectRepository(CafeReservation)
    private readonly cafeReservationsRepository: Repository<CafeReservation>,

    @InjectRepository(CafeList)
    private readonly cafeListsRepository: Repository<CafeList>,
  ) {}

  async find({ cafeReservationId }) {
    return await this.cafeReservationsRepository.findOne({
      where: { id: cafeReservationId },
      relations: ['cafeList', 'user'],
    });
  }

  async findbyUser({ userId }) {
    const result = await this.cafeReservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['cafeList', 'user'],
    });
    return result.length;
  }

  async findUser({ page }) {
    return await this.cafeReservationsRepository.find({
      relations: ['cafeList', 'user'],
      take: 3,
      skip: page ? (page - 1) * 3 : 0,
    });
  }

  async create({ createReservationInput }) {
    const { userId, cafeListId } = createReservationInput;
    userId;

    const cafeList = await this.cafeListsRepository.findOne({
      where: { id: cafeListId },
    });

    const result = await this.cafeReservationsRepository.save({
      ...createReservationInput,
      title: cafeList.title,
      deposit: cafeList.deposit,
      user: userId,
      cafeList: cafeListId,
    });
    return result;
  }
}
