/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './entities/publicacion.entity';
import { Model } from 'mongoose';
import { verify } from 'jsonwebtoken';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private PublicacionModel: Model<Publicacion>,
    @InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>,
  ) {}

  async publicar(publicacion: CreatePublicacionesDto, auth: string) {
    if (!auth) {
      throw new UnauthorizedException();
    }

    const token = auth.replace('Bearer ', '');

    const payload: any = verify(token, process.env.CLAVE_SUPERSECRETA!);

    try {
      const publicacionCreada = await this.PublicacionModel.create({
        ...publicacion,
        usuario: payload._id,
      });
      return publicacionCreada;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async listar(
    orden: string,
    limite: number,
    offset: number,
    usuario?: string,
  ) {
    try {
      const filtro: any = { activo: true };

      if (usuario) {
        filtro.usuario = usuario;
      }

      const publicaciones = await this.PublicacionModel.aggregate([
        { $match: filtro },
        { $addFields: { cantidadMeGusta: { $size: '$meGusta' } } },
        {
          $sort:
            orden === 'megusta' ? { cantidadMeGusta: -1 } : { creadoEn: -1 },
        },
        { $skip: Number(offset) || 0 },
        { $limit: Number(limite) || 5 },
      ]);

      for (const publicacion of publicaciones) {
        const usuario = await this.UsuarioModel.findById(publicacion.usuario);

        publicacion.usuarioNombre = usuario?.nombreDeUsuario;

        publicacion.usuarioImagen = usuario?.imagenDePerfil;
      }

      return publicaciones;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacione`;
  }

  update(id: number, updatePublicacionesDto: UpdatePublicacionesDto) {
    return `This action updates a #${id} publicacione`;
  }

  async eliminar(id: string, auth: string) {
    if (!auth) {
      throw new UnauthorizedException();
    }
    const token = auth.replace('Bearer ', '');

    const payload: any = verify(token, process.env.CLAVE_SUPERSECRETA!);

    try {
      const publicacion = await this.PublicacionModel.findById(id);

      if (!publicacion) {
        throw new UnauthorizedException();
      }

      if (publicacion.usuario.toString() !== payload._id.toString()) {
        throw new UnauthorizedException();
      }

      await this.PublicacionModel.updateOne({ _id: id }, { activo: false });
      return { message: 'Publicación borrada' };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async likear(id: string, auth: string) {
    if (!auth) {
      throw new UnauthorizedException();
    }
    const token = auth.replace('Bearer ', '');

    const payload: any = verify(token, process.env.CLAVE_SUPERSECRETA!);
    try {
      const publicacion = await this.PublicacionModel.findById(id);

      if (!publicacion) {
        throw new UnauthorizedException();
      }

      await this.PublicacionModel.updateOne(
        { _id: id },
        { $addToSet: { meGusta: payload._id } },
      );

      return { message: 'Publicación likeada' };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async deslikear(id: string, auth: string) {
    if (!auth) {
      throw new UnauthorizedException();
    }

    const token = auth.replace('Bearer ', '');

    const payload: any = verify(token, process.env.CLAVE_SUPERSECRETA!);

    try {
      const publicacion = await this.PublicacionModel.findById(id);

      if (!publicacion) {
        throw new UnauthorizedException();
      }

      await this.PublicacionModel.updateOne(
        { _id: id },
        { $pull: { meGusta: payload._id } },
      );

      return { message: 'Publicación dislikeada' };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
