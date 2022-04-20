export class CreatePrivilegeDto {
  name: string;
  read: boolean;
  write: boolean;
  roles:number[];
}
