import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Futbolistas {
  @Prop()
  nombre: string;

  @Prop()
  edad: number;

  @Prop()
  va_al_mundial: boolean;

  @Prop()
  pais: string;
}

export const FutbolistaSchema = SchemaFactory.createForClass(Futbolistas);
