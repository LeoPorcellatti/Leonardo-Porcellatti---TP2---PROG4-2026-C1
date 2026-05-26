import { IsString } from 'class-validator';

export class LoginUsuarioDTO {
  @IsString()
  metodoIngreso;

  @IsString()
  password;
}
