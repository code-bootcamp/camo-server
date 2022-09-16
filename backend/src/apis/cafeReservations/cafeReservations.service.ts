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
