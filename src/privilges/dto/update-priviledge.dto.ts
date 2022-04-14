import { PartialType } from '@nestjs/mapped-types';
import { CreatePriviledgeDto } from './create-priviledge.dto';

export class UpdatePriviledgeDto extends PartialType(CreatePriviledgeDto) {}
