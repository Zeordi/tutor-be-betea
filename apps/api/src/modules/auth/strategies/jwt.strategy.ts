import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";
import { redis } from "../../../config/redis";

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

  async validate(payload: { sub: string; role: string; jti?: string }) {
    if (payload.jti) {
      try {
        const revoked = await redis.get(`revoked_access:${payload.jti}`);
        if (revoked) {
          throw new UnauthorizedException("Token has been revoked");
        }
      } catch {
        // Redis failure: fail open so a valid JWT is not rejected
      }
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user || user.status === "BANNED" || user.status === "SUSPENDED") {
      throw new UnauthorizedException("User is not allowed to access the system");
    }

    return {
      id: user.id,
      role: user.role,
      status: user.status,
      jti: payload.jti,
    };
  }
}
