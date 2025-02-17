import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';





@Injectable()
export class AuthService {
    [x: string]: any;
    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        private jwtService: JwtService,

    ) { }


    async signUp(email: string, password: string) {
        try {
            // Check if the email already exists
            const existingUser = await this.usersRepository.findOne({ where: { email } });

            if (existingUser) {
                return 'Email already registered';
            }

            // Hash the password securely
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user instance
            const user = this.usersRepository.create({ email, password: hashedPassword });

            // Save the user to the database
            await this.usersRepository.save(user);

            return { message: 'User registered successfully' };
        } catch (error) {
            console.error('Signup Error:', error); // Log the actual error for debugging

            // If the error is a known type, throw it directly
            if (error instanceof ConflictException) {
                throw error;
            }

            // Otherwise, throw a generic internal server error
            throw new InternalServerErrorException('Something went wrong during registration');
        }
    }

    async signIn(user: any): Promise<{ token: string }> {
        const payload = { email: user.email, sub: user.id };
        return { token: this.jwtService.sign(payload) };
    }



    async validateUser(email: string, password: string): Promise<any> {

        const user = await this.usersRepository.findOne({ where: { email } })


        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');


        }
        return user;
    }

    async googleSignIn(googleId: string, email: string) {
        let user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            user = this.usersRepository.create({ email, googleId });
            await this.usersRepository.save(user);
        }

        return this.generateToken(user);
    }


    private generateToken(user: Users) {
        const payload = { sub: user.id, email: user.email };
        return { access_token: this.jwtService.sign(payload) };
    }


    async microSoftSignIn(microsoftId: string, email: string) {

        let user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            user = this.usersRepository.create({ email, microsoftId });
            await this.usersRepository.save(user);
        }
        return this.generateToken(user);
    }

}
