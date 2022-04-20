export class CreatePriviledgeDto {
  name: string;
  read: boolean;
  write: boolean;
  roles:number[];
}
