import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivilegeDto } from './create-privilege.dto';

export class UpdatePriviledgeDto extends PartialType(CreatePrivilegeDto) {}
