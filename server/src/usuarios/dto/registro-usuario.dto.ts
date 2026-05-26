import { IsOptional, IsString } from 'class-validator';

export class RegistroUsuarioDTO {
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
