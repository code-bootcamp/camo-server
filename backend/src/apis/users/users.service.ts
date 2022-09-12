import {
  CACHE_MANAGER,
  ConflictException,
  Controller,
  Inject,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entites/user.entity';
import * as coolsms from 'coolsms-node-sdk';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { RolesGuard } from 'src/commons/auth/roles.guard';
import { Roles } from 'src/commons/auth/roles.decorator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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
      ...updateUserInput,
      password: loginhash,
    });
    return result;
  }

  // 관리자용
  //
  //
  //
  //
  //
  /** 유저 Delete */
  async delete({ password, userId }) {
    const user = await this.findOne({ userId });
    const userPassword = user.password;
    const isAuth = await bcrypt.compare(password, userPassword);
    if (isAuth === false)
      throw new UnauthorizedException('비밀번호를 확인해주세요');

    const deleteresult = await this.usersRepository.softDelete({
      id: user.id,
    });
    return deleteresult.affected ? true : false;
  }

  /** 유저 복구 */
  async restore({ email }) {
    const result = await this.usersRepository.restore({ email });
    return result.affected ? true : false;
  }

  //** 랜덤 토큰 생성 */
  getToken() {
    return String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
  }

  //** SMS 인증문자 전송 */
  async sendTokenToSMS({ phoneNumber }) {
    const SMS_KEY = process.env.SMS_KEY;
    const SMS_SECRET = process.env.SMS_SECRET;
    const SMS_SENDER = process.env.SMS_SENDER;

    const checkUserPhoneNumber = await this.usersRepository.findOne({
      where: { phoneNumber: phoneNumber },
    });
    if (checkUserPhoneNumber)
      throw new ConflictException('이미 등록된 번호입니다.');

    try {
      const token = this.getToken();
      const mysms = coolsms.default;
      const messageServicae = new mysms(SMS_KEY, SMS_SECRET);
      await messageServicae.sendOne({
        to: phoneNumber,
        from: SMS_SENDER,
        text: `[Camo] 회원가입 인증번호는 [${token}]입니다.`,
        autoTypeDetect: true,
      });

      const myToken = await this.cacheManager.get(phoneNumber);
      if (myToken) await this.cacheManager.del(phoneNumber);

      await this.cacheManager.set(phoneNumber, token, { ttl: 180 });
      return token;
    } catch (error) {
      if (error) {
        throw new UnauthorizedException(
          '오류가 발생하였습니다. 페이지 관리자에게 문의해 주십시오',
        );
      }
    }
  }

  /** 삭제된 유저 조회 Admin */
  async WithDelete() {
    return await this.usersRepository.find({
      withDeleted: true,
    });
  }
}
