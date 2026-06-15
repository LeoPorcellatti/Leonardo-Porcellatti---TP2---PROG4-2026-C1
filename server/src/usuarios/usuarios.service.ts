/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RegistroUsuarioDTO } from './dto/registro-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { verify } from 'jsonwebtoken';
import { hash } from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { resolve } from 'path';
import { rejects } from 'assert';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>,
  ) {}

  async traerTodosLosUsuarios(auth: string) {
    if (!auth) {
      throw new UnauthorizedException();
    }

    try {
      const token = auth.replace('Bearer ', '');
      const payload: any = verify(token, process.env.CLAVE_SUPERSECRETA!);

      if (payload.perfil === 'administrador') {
        const usuariosSinPassword = await this.UsuarioModel.find(
          {},
          { password: 0 },
        );

        return usuariosSinPassword;
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async obtenerUsuarioPorId(id: string) {
    try {
      const usuario = await this.UsuarioModel.findById(id);

      if (!usuario) {
        throw new NotFoundException();
      }
      const { password, ...usuarioSinPassword } = usuario.toObject();

      return usuarioSinPassword;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async crearUsuario(
    usuario: RegistroUsuarioDTO,
    auth: string,
    imagenDePerfil: Express.Multer.File,
  ) {
    if (!auth) {
      throw new NotFoundException();
    }

    if (!imagenDePerfil) {
      throw new BadRequestException();
    }

    try {
      const token = auth.replace('Bearer ', '');
      const payload: any = verify(token, process.env.CLAVE_SUPERSECRETA!);

      if (payload.perfil !== 'administrador') {
        throw new UnauthorizedException();
      }

      if (payload.perfil === 'administrador') {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const public_id = `IMG_PERFIL_${Date.now()}`;

        const urlImagen = await new Promise<string>((resolve, reject) => {
          const uploader = cloudinary.uploader.upload_stream(
            {
              folder: 'imagenes_de_perfil',
              public_id: public_id,
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result!.secure_url);
              }
            },
          );
          uploader.end(imagenDePerfil.buffer);
        });

        const passwordHasheada = await hash(usuario.password, 10);

        const usuarioCreado = await this.UsuarioModel.create({
          ...usuario,
          password: passwordHasheada,
          imagenDePerfil: urlImagen,
        });

        return usuarioCreado;
      }
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
