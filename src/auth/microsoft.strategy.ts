
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Strategy } from 'passport-oauth2';
import { AuthService } from './auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {
        super({
            authorizationURL: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize',
            tokenURL: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
            clientID: configService.get<string>('auth.microsoft.clientId'),
            clientSecret: configService.get<string>('auth.microsoft.clientSecret'),
            callbackURL: configService.get<string>('auth.microsoft.callBackUrl'),
            scope: ['openid', 'email', 'profile', 'User.Read'], // Add User.Read scope
            passReqToCallback: true, // Ensure `req` is passed to `validate`
        });
    }

    async validate(
        req: any, // Include `req` parameter
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function,
    ) {
        try {
            // Fetch user profile from Microsoft Graph API
            const { data } = await axios.get('https://graph.microsoft.com/v1.0/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            console.log('Microsoft Profile:', data);

            // Extract required fields
            const { id, mail, userPrincipalName } = data;
            const email = mail || userPrincipalName;

            // Validate fields
            if (!id || !email) {
                throw new Error('Microsoft profile is missing required fields (id or email)');
            }

            // Call authService to handle user login/registration
            const user = await this.authService.microSoftSignIn(id, email);
            done(null, user);
        } catch (error) {
            console.error('Error in Microsoft OAuth:', error.response?.data || error.message);
            done(error, false);
        }
    }
}




















