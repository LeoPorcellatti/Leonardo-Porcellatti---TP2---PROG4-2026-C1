/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { compare, hash } from 'bcrypt';
import { RegistroUsuarioDTO } from '../usuarios/dto/registro-usuario.dto';
import { LoginUsuarioDTO } from '../usuarios/dto/login-usuario.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AutenticacionService {
  constructor(
    @InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>,
  ) {}

  async registro(usuario: RegistroUsuarioDTO) {
    try {
      const passwordHasheada = await hash(usuario.password, 10);

      const usuarioCreado = await this.UsuarioModel.create({
        ...usuario,
        password: passwordHasheada,
      });

      const payload = {
        email: usuarioCreado.email,
        _id: usuarioCreado._id,
        exp: Date.now() + 60 * 15,
      };

      const jwt = sign(payload, process.env.CLAVE_SUPERSECRETA!, {
        algorithm: 'HS256',
        audience: 'registro',
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
        exp: Date.now() + 60 * 15,
      };

      const jwt = sign(payload, process.env.CLAVE_SUPERSECRETA!, {
        algorithm: 'HS256',
        audience: 'login',
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
  // async findOne(id: number) {
  //   return 'respuestaEnProgreso';
  // }

  // async update(id: number, updateAutenticacionDto: UpdateAutenticacionDto) {
  //   return 'respuestaEnProgreso';
  // }

  // async remove(id: number) {
  //   return 'respuestaEnProgreso';
  // }
}
