import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentarios.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {
  @IsString()
  @IsNotEmpty()
  mensaje: string;
}
