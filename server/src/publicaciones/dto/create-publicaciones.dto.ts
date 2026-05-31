import { IsOptional, IsString } from 'class-validator';

export class CreatePublicacioneDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
