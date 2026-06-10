import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RegistroUsuarioDTO } from './dto/registro-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get(':id')
  ObtenerUsuarioPorId(@Param('id') id: string) {
    return this.usuariosService.obtenerUsuarioPorId(id);
  }

  @Post()
  create(@Body() createUsuarioDto: RegistroUsuarioDTO) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
