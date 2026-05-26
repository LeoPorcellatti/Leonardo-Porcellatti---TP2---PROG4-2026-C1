import { PartialType } from '@nestjs/mapped-types';
import { RegistroUsuarioDTO } from './registro-usuario.dto';

export class UpdateUsuarioDto extends PartialType(RegistroUsuarioDTO) {}
