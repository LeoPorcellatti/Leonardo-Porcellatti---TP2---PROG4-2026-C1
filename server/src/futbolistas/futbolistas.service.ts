import { Injectable } from '@nestjs/common';
import { CreateFutbolistaDto } from './dto/create-futbolista.dto';
import { UpdateFutbolistaDto } from './dto/update-futbolista.dto';
import { Futbolistas } from './entities/futbolista.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FutbolistasService {
  constructor(
    @InjectModel('Futbolistas') private FutbolistaModel: Model<Futbolistas>,
  ) {}

  async create(createFutbolistaDto: CreateFutbolistaDto) {
    const futbolistaCreado =
      await this.FutbolistaModel.create(createFutbolistaDto);

    return futbolistaCreado;
  }

  async findAll() {
    const futbolistas = await this.FutbolistaModel.find();
    return futbolistas;
  }

  async findOne(id: string) {
    const futbolistas = await this.FutbolistaModel.findById(id);
    return futbolistas;
  }

  async update(id: string, updateFutbolistaDto: UpdateFutbolistaDto) {
    const futbolistaModificado = await this.FutbolistaModel.updateOne(
      { _id: id },
      updateFutbolistaDto,
    );
    return futbolistaModificado;
  }

  async remove(id: string) {
    const futbolistaElimnado = await this.FutbolistaModel.deleteOne({
      _id: id,
    });
    return futbolistaElimnado;
  }
}
