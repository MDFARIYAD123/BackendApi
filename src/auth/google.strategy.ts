import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService,
        private configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('auth.google.clientId'),

            clientSecret: configService.get<string>('auth.google.clientSecret'),
            callbackURL: configService.get<string>('auth.google.callBackUrl'),

            scope: ['email', 'profile', 'openid',],
            // passReqToCallback: true,

        });
    }




    async validate(accessToken: string, refreshToken: string, profile: any,
        done: VerifyCallback,) {
        console.log(profile)



        const { id, emails, } = profile;
        const user = await this.authService.googleSignIn(id, emails[0].value);
        done(null, user);
    }
}
