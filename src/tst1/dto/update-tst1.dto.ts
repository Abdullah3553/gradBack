import { PartialType } from '@nestjs/mapped-types';
import { CreateTst1Dto } from './create-tst1.dto';

export class UpdateTst1Dto extends PartialType(CreateTst1Dto) {}
