import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: { sub: string; role: string }) {
    const user = await this.usersService.findById(payload.sub);

    if (!user || user.status === "BANNED" || user.status === "SUSPENDED") {
      throw new UnauthorizedException("User is not allowed to access the system");
    }

    return {
      id: user.id,
      role: user.role,
      status: user.status,
    };
  }
}
