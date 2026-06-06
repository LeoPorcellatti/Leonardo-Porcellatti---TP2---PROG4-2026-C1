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
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

function crearStorage() {
  cloudinary.config({
    cloud_name: 'dlmzdmcuh',
    //process.env.CLOUDINARY_CLOUD_NAME,
    api_key: '582149334161213',
    // process.env.CLOUDINARY_API_KEY,
    api_secret: 'imMrIstl_leBLupQSeBzawUIIxI',
    //process.env.CLOUDINARY_API_SECRET,
  });

  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'imagenes_de_perfil',
      public_id: (req: any, file: any) => `PERFIL_${Date.now()}`,
    } as any,
  });
}

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('/registro')
  @UseInterceptors(
    FileInterceptor('imagenDePerfil', { storage: crearStorage() }),
  )
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
