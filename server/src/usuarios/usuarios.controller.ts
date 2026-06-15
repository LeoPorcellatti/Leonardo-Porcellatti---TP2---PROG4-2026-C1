/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RegistroUsuarioDTO } from './dto/registro-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  traerTodosLosUsuarios(@Headers('authorization') auth: string) {
    return this.usuariosService.traerTodosLosUsuarios(auth);
  }

  @Get(':id')
  ObtenerUsuarioPorId(@Param('id') id: string) {
    return this.usuariosService.obtenerUsuarioPorId(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagenDePerfil'))
  crearUsuario(
    @Body() usuario: RegistroUsuarioDTO,
    @Headers('authorization') auth: string,
    @UploadedFile() imagenDePerfil: Express.Multer.File,
  ) {
    return this.usuariosService.crearUsuario(usuario, auth, imagenDePerfil);
  }
}
