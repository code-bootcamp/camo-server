// import { ConflictException, Injectable } from '@nestjs/common';
// // import { InjectRepository } from '@nestjs/typeorm';
// // import { Repository } from 'typeorm';
// // import { CafeOwner } from './entities/cafeOwner.entity';

// @Injectable()
// export class CafeOwnersService {
//   constructor() // @InjectRepository(CafeOwner)
//   // private readonly cafeOwnersRepository: Repository<CafeOwner>,
//   {}

//   // async findOne({ email }) {
//   //   return await this.cafeOwnersRepository.find({
//   //     where: { email: email },
//   //   });
//   // }

//   // async create({ createCafeOwnerInput }) {
//   //   const { email, password, name, phoneNumber, cafeName } =
//   //     createCafeOwnerInput;
//   //   const cafeOwner = await this.cafeOwnersRepository.findOne({
//   //     where: { email: email },
//   //   });
//   //   if (cafeOwner) throw new ConflictException('이미 등록된 이메일입니다.');
//   //   return await this.cafeOwnersRepository.save({
//   //     email,
//   //     password,
//   //     name,
//   //     phoneNumber,
//   //     cafeName,
//   //   });
//   // }
// }
