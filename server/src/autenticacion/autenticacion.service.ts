/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { compare, hash } from 'bcrypt';
import { RegistroUsuarioDTO } from '../usuarios/dto/registro-usuario.dto';
import { LoginUsuarioDTO } from '../usuarios/dto/login-usuario.dto';
import { sign, verify } from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { Multer } from 'multer';
import { resolve } from 'path';
import { rejects } from 'assert';

@Injectable()
export class AutenticacionService {
  constructor(
    @InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>,
  ) {}

  async registro(
    usuario: RegistroUsuarioDTO,
    imagenDePerfil?: Express.Multer.File,
  ) {
    try {
      let urlImagen = process.env.IMAGEN_PERFIL_DEFAULT!;

      if (imagenDePerfil) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const public_id = `IMG_PERFIL_${Date.now()}`;

        urlImagen = await new Promise<string>((resolve, reject) => {
          const uploader = cloudinary.uploader.upload_stream(
            {
              folder: 'imagenes_de_perfil',
              public_id: public_id,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            },
          );
          uploader.end(imagenDePerfil.buffer);
        });
      }

      const passwordHasheada = await hash(usuario.password, 10);

      const usuarioCreado = await this.UsuarioModel.create({
        ...usuario,
        password: passwordHasheada,
        imagenDePerfil: urlImagen,
      });

      const payload = {
        email: usuarioCreado.email,
        _id: usuarioCreado._id,
        perfil: usuarioCreado.perfil,
      };

      const jwt = sign(payload, process.env.CLAVE_SUPERSECRETA!, {
        expiresIn: '15m',
      });

      return jwt;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async login(usuario: LoginUsuarioDTO) {
    try {
      const usuarioLogueado = await this.UsuarioModel.findOne({
        $or: [
          { email: usuario.metodoIngreso },
          { nombreDeUsuario: usuario.metodoIngreso },
        ],
      });

      if (!usuarioLogueado) {
        throw new UnauthorizedException();
      }

      const passwordValidada = await compare(
        usuario.password,
        usuarioLogueado.password,
      );

      if (!passwordValidada) {
        throw new UnauthorizedException();
      }

      const payload = {
        email: usuarioLogueado.email,
        _id: usuarioLogueado._id,
        perfil: usuarioLogueado.perfil,
      };

      const jwt = sign(payload, process.env.CLAVE_SUPERSECRETA!, {
        expiresIn: '2m',
      });

      const { password, ...usuarioSinPassword } = usuarioLogueado.toObject();
      console.log(jwt);
      console.log(usuarioLogueado);

      return { token: jwt, usuario: usuarioSinPassword };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async autorizar(auth: string) {
    if (!auth) {
      throw new UnauthorizedException();
    }

    try {
      const token = auth.replace('Bearer ', '');
      const payload: any = verify(token, process.env.CLAVE_SUPERSECRETA!);

      const usuario = await this.UsuarioModel.findById(payload._id);

      if (!usuario) {
        throw new UnauthorizedException();
      }

      const { password, ...usuarioSinPassword } = usuario.toObject();

      return usuarioSinPassword;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  refrescar(auth: string) {
    if (!auth) throw new UnauthorizedException();

    try {
      const token = auth.replace('Bearer ', '');
      const payload: any = verify(token, process.env.CLAVE_SUPERSECRETA!);

      const nuevoJwt = sign(
        { email: payload.email, _id: payload._id, perfil: payload.perfil },
        process.env.CLAVE_SUPERSECRETA!,
        { expiresIn: '15m' },
      );

      return nuevoJwt;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
