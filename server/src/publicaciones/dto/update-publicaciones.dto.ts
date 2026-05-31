import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicacioneDto } from './create-publicaciones.dto';

export class UpdatePublicacioneDto extends PartialType(CreatePublicacioneDto) {}
