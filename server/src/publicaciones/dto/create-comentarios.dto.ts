import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComentarioDto {
  @IsString()
  @IsNotEmpty()
  publicacion: string;

  @IsString()
  @IsNotEmpty()
  mensaje: string;
}
