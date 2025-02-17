import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './jwt-authgurad';
import { MicrosoftAuthGuard } from './microsoft-auth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private configService: ConfigService,
    ) { }


    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto.email, createUserDto.password);
    }


    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async signIn(@Req() req, @Res() res: Response) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // Generate JWT token
            const token = await this.authService.signIn(user);
            console.log("Generated Token:", token);

            return res.status(200).json(token);
        } catch (error) {
            console.error('Sign-in error:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }



    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async googleLogin() { }

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleAuthRedirect(@Req() req, @Res() res: Response) {

        const { googleId, email } = req.user;

        // Sign the user in or create a new user and generate a token
        const token = await this.authService.googleSignIn(googleId, email);
        console.log("Generated Token:", token);


        const tokenString = typeof token === 'object' ? JSON.stringify(token) : token;

        const frontendRedirectUrl = this.configService.get<string>('auth.frontendRedirect');

        // Redirect to the frontend with the token
        return res.redirect(`${frontendRedirectUrl}?token=${encodeURIComponent(tokenString)}`);


    }


    @UseGuards(JwtAuthGuard)
    @Get('protected-route')
    async get() {
        return "this  is protected route";
    }

    @UseGuards(MicrosoftAuthGuard)
    @Get('microsoft')
    async microsoftLogin() { }

    @UseGuards(MicrosoftAuthGuard)
    @Get('microsoft/callback')
    async microsoftAuthRedirect(@Req() req, @Res() res: Response) {

        const { microsoftId, email } = req.user;


        const token = await this.authService.microSoftSignIn(microsoftId, email);

        const tokenString = typeof token === 'object' ? JSON.stringify(token) : token;

        const frontendRedirectUrl = this.configService.get<string>('auth.frontendRedirect');

        // Redirect to the frontend with the token
        return res.redirect(`${frontendRedirectUrl}?token=${encodeURIComponent(tokenString)}`);
        // Chnage url for microsoft ask atif this is google url



    }

}
