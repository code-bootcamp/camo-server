import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

@Injectable()
export class jwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientSECRET: process.env.KAKAO_CLIENT_SECRET,
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      // scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string, //
    refreshToken: string,
    profile: Profile,
  ) {
    return {
      email: profile._json.kakao_account.email,
      hashedPassword: '1',
      name: profile._json.properties.nickname,
      age: profile._json.kakao_account.age_range.slice(0, 2),
    };
  }
}
