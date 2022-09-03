import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: String(process.env.ACCESS_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }
  validate(_, payload) {
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
