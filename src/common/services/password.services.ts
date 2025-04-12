import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordServis {
    async hasPassword(password: string): Promise<string> {
        const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
        
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(plainPassword: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hash);
    }
}