/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegistroUsuarioDTO } from '../usuarios/dto/registro-usuario.dto';
import { LoginUsuarioDTO } from '../usuarios/dto/login-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('/registro')
  @UseInterceptors(FileInterceptor('imagenDePerfil'))
  create(
    @Body() usuario: RegistroUsuarioDTO,
    @UploadedFile() imagenDePerfil: Express.Multer.File,
  ) {
    return this.autenticacionService.registro(usuario, imagenDePerfil);
  }

  @Post('/login')
  @HttpCode(200)
  findOne(@Body() usuario: LoginUsuarioDTO) {
    return this.autenticacionService.login(usuario);
  }

  // @Post('/login'){
  //   findOne(@Param('email'))
  // }

  // @Get()
  // findAll() {
  //   return this.autenticacionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.autenticacionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAutenticacionDto: UpdateAutenticacionDto,
  // ) {
  //   return this.autenticacionService.update(+id, updateAutenticacionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.autenticacionService.remove(+id);
  // }
}
