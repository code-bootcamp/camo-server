import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entites/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /** 모든 유저 조회 */
  async findAll() {
    return await this.usersRepository.find({});
  }

  /** 개별 유저 조회 */
  async findOneUser({ email }) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  /** 개별 유저 조회 */
  async findOne({ userId }) {
    return await this.usersRepository.findOne({
      where: { id: userId },
    });
  }

  /** 삭제된 유저 조회 */
  async WithDelete() {
    return await this.usersRepository.find({
      withDeleted: true,
    });
  }

  /** 일반 유저 생성 */
  async create({
    email,
    hashedPassword: password,
    name,
    phoneNumber,
    nickName,
  }) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');

    return await this.usersRepository.save({
      email,
      password,
      name,
      phoneNumber,
      nickName,
    });
  }

  async update({ email, updateUserInput, loginhash }) {
    // 수정 후 결과값까지 받을 때 사용
    const userList = await this.usersRepository.findOne({
      where: { email },
    });

    const result = this.usersRepository.save({
      ...userList,
      email,
      ...updateUserInput,
      password: loginhash,
    });
    return result;
  }

  /** 유저 Delete */
  async delete({ email }) {
    const deleteresult = await this.usersRepository.softDelete({
      email: email,
    });
    return deleteresult.affected ? true : false;
  }

  /** 유저 복구 */
  async restore({ email }) {
    const result = await this.usersRepository.restore({ email });
    return result.affected ? true : false;
  }
}
