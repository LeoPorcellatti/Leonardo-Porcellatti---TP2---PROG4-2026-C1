import { IsOptional, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre;

  @IsString()
  apellido;

  @IsString()
  email;

  @IsString()
  nombreDeUsuario;

  @IsString()
  password;

  @IsString()
  fechaDeNacimiento;

  @IsString()
  descripcion;

  @IsString()
  imagenDePerfil;

  @IsOptional()
  @IsString()
  perfil;
}
