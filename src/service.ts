import { Injectable } from '@nestjs/common';

@Injectable()
export class Service {
  getHello(): string {
    return 'Lamees hena :D ';
  }

  HolaAseel(): string {
    return 'Aseel hena :D ';
  }
}
