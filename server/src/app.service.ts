import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Estoy en SERVER - APP.Service!';
  }
}
