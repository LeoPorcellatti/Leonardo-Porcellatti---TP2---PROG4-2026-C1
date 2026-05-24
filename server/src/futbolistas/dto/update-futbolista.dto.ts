import { PartialType } from '@nestjs/mapped-types';
import { CreateFutbolistaDto } from './create-futbolista.dto';

export class UpdateFutbolistaDto extends PartialType(CreateFutbolistaDto) {}
