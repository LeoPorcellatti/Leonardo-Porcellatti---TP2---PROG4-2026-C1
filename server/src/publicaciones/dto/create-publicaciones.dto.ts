import { IsOptional, IsString } from 'class-validator';

export class CreatePublicacionesDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
