import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Lamees hena :D ';
  }

  HolaAseel(): string {
    return 'Aseel hena :D ';
  }
}
