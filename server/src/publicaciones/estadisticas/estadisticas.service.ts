/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { verify } from 'jsonwebtoken';
import { Publicacion } from '../entities/publicacion.entity';
import { Model } from 'mongoose';
import { Comentario } from '../entities/comentario.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name) private PublicacionModel: Model<Publicacion>,
    @InjectModel(Comentario.name) private ComentarioModel: Model<Comentario>,
  ) {}
  private extraerPayload(auth: string) {
    if (!auth) {
      throw new UnauthorizedException();
    }

    try {
      const token = auth.replace('Bearer ', '');
      return verify(token, process.env.CLAVE_SUPERSECRETA!) as any;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private verificarAdmin(auth: string) {
    const payload = this.extraerPayload(auth);
    if (payload.perfil !== 'administrador') {
      throw new UnauthorizedException();
    }

    return payload;
  }

  async publicacionesPorUsuario(desde: string, hasta: string, auth: string) {
    this.verificarAdmin(auth);

    const fechaHasta = new Date(hasta);
    fechaHasta.setUTCHours(23, 59, 59, 999);

    const resultado = await this.PublicacionModel.aggregate([
      {
        $match: {
          activo: true,
          creadoEn: {
            $gte: new Date(desde),
            $lte: fechaHasta,
          },
        },
      },
      {
        $group: {
          _id: '$usuario',
          cantidad: { $sum: 1 },
        },
      },
    ]);
    console.log('resultado:', resultado);
    return resultado;
  }

  async comentariosPorFechas(desde: string, hasta: string, auth: string) {
    this.verificarAdmin(auth);
    const fechaHasta = new Date(hasta);
    fechaHasta.setUTCHours(23, 59, 59, 999);

    const resultado = await this.ComentarioModel.aggregate([
      {
        $match: {
          activo: true,
          creadoEn: {
            $gte: new Date(desde),
            $lte: fechaHasta,
          },
        },
      },
      {
        $group: {
          _id: '$usuario',
          cantidad: { $sum: 1 },
        },
      },
    ]);
    console.log('resultado:', resultado);
    return resultado;
  }

  async comentariosPorPublicacion(desde: string, hasta: string, auth: string) {
    this.verificarAdmin(auth);

    const fechaHasta = new Date(hasta);
    fechaHasta.setUTCHours(23, 59, 59, 999);

    const resultado = await this.ComentarioModel.aggregate([
      {
        $match: {
          activo: true,
          creadoEn: {
            $gte: new Date(desde),
            $lte: fechaHasta,
          },
        },
      },
      {
        $group: {
          _id: '$publicacion',
          cantidad: { $sum: 1 },
        },
      },
    ]);
    console.log('resultado:', resultado);
    return resultado;
  }
}
