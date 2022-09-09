import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
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

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /** AccessToken 발급 */
  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '2w' },
    );
    // 배포시 expireIn: 15Minute 설정
  }

  /** refreshToken 발급 */
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '2w' },
    );
    // 개발환경
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    // 배포환경
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.cafemoment-backend.site; SameSite=None; Secure; httpOnly;`,
    );
  }

  /** 소셜 회원 로그인 */
  async getSocialLogin({ req, res }) {
    let user = await this.usersService.findOneUser({ email: req.user.email });
    if (!user) user = await this.usersService.create({ ...req.user });
    this.setRefreshToken({ user, res });
    res.redirect('http://localhost:3000');
  }

  /** 일반 유저 로그인 */
  async getUserLogin({ email, password, context }) {
    const user = await this.usersService.findOneUser({ email });
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    this.setRefreshToken({ user, res: context.res });

    return this.getAccessToken({ user });
  }

  /** 일반 유저 로그아웃 */
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
      // 3. chacheManager를 이용해서 두 토큰을 각각 저장하기
      await this.cacheManager.set(`accessToken:${accessToken}`, 'accessToken', {
        ttl: accessTokenTTL,
      });

      await this.cacheManager.set(
        `refreshToken:${refreshToken}`,
        'refreshToken',
        {
          ttl: refreshTokenTTL,
        },
      );

      return '로그아웃에 성공했습니다.';
    } catch {
      (error) => {
        if (error) throw new UnauthorizedException('인증 오류 발생');
      };
    }
  }

  /** 유저 SMS Tken 검증 */
  async checkSMSTokenValid({ phoneNumber, SMSToken }) {
    const isSMSToken = await this.cacheManager.get(phoneNumber);
    if (!isSMSToken) throw new ConflictException('휴대폰 번호를 확인해주세요');
    if (isSMSToken !== SMSToken)
      throw new ConflictException('인증번호가 올바르지 않습니다.');
  }

  /** 로그아웃을 위한 token TTL 구하기  */
  getTTL(token) {
    const now = new Date().getTime();
    const tokenTTL = token.exp - Number(String(now).slice(0, -3));
    return tokenTTL;
  }
}
