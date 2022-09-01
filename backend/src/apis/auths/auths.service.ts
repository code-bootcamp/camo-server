import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthsService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly usersService: UsersService,
  ) {}

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id }, // payload
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '2w' },
    );
  }

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '2w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }

  getTTL(token) {
    const now = new Date().getTime();
    const tokenTTL = token.exp - Number(String(now).slice(0, -3));
    return tokenTTL;
  }

  async getSocialLogin({ req, res }) {
    // 가입 확인
    let user = await this.usersService.findOne({ email: req.user.email });
    // 가입 안되어 있으면 회원 가입
    if (!user) user = await this.usersService.create({ ...req.user });
    // 3. 로그인
    this.setRefreshToken({ user, res });
    // redirect
    res.redirect(
      'http://localhost:5501/codecamp-backend-04/homework/main-project/frontend/login/index.html',
    );
  }

  //
  //
  //
  //
  //

  async getUserLogin({ email, password, context }) {
    const user = await this.usersService.findOne({ email });
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    this.setRefreshToken({ user, res: context.res });

    return this.getAccessToken({ user });
  }

  async getLogout({ context }) {
    try {
      // 토큰 구하기
      const accessToken = context.req.headers['authorization'].split(' ')[1];
      const refreshToken = context.req.headers['cookie'].split('=')[1];

      // 2. jsonwebtoken 라이브러리를 이용해서 두 토큰을 검증하기.
      const decodedAccessToken: any = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
      );
      const decodedRefreshToken: any = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      // 토큰 만료시간 구하기
      const accessTokenTTL = this.getTTL(decodedAccessToken);
      const refreshTokenTTL = this.getTTL(decodedRefreshToken);

      // cacheManager 연결 이후에 사용
      // // 3. chacheManager를 이용해서 두 토큰을 각각 저장하기
      // await this.cacheManager.set(`accessToken:${accessToken}`, 'accessToken', {
      //   ttl: accessTokenTTL,
      // });

      // await this.cacheManager.set(
      //   `refreshToken:${refreshToken}`,
      //   'refreshToken',
      //   {
      //     ttl: refreshTokenTTL,
      //   },
      // );

      return '로그아웃에 성공했습니다.';
    } catch {
      (error) => {
        if (error) throw new UnauthorizedException('인증 오류 발생');
      };
    }
  }
}
