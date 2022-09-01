import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string, //
    refreshToken: string,
    profile: Profile,
  ) {
    console.log(profile);
    return {
      email: profile.emails[0].value,
      hashedPassword: '1',
      name: profile.displayName,
      age: 0,
    };
  }
}
