import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeList } from '../cafeLists/entities/cafeList.entity';
import { UsersService } from '../users/users.service';
import { CafeReservation } from './entities/cafeReservations.entity';

@Injectable()
export class CafeReservationsService {
  constructor(
    @InjectRepository(CafeReservation)
    private readonly cafeReservationsRepository: Repository<CafeReservation>,

    private readonly usersService: UsersService,

    @InjectRepository(CafeList)
    private readonly cafeListsRepository: Repository<CafeList>,
  ) {}

  async create({ createReservationInput }) {
    const { userId, cafeListId } = createReservationInput;
    userId;

    const cafeList = await this.cafeListsRepository.findOne({
      where: { id: cafeListId },
    });

    return await this.cafeReservationsRepository.save({
      ...createReservationInput,
      title: cafeList.title,
      user: userId,
      cafeList: cafeListId,
    });
  }
}
