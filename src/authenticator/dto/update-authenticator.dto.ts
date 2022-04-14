import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthenticatorDto } from './create-authenticator.dto';

export class UpdateAuthenticatorDto extends PartialType(CreateAuthenticatorDto) {}
