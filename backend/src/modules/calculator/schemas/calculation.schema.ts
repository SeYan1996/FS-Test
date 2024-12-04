import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Calculation {
  @Prop({ required: true })
  operation: string;

  @Prop({ required: true })
  inputs: number[];

  @Prop({ required: true })
  result: number;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop()
  responseTime: number;
}

export type CalculationDocument = Calculation & Document;
export const CalculationSchema = SchemaFactory.createForClass(Calculation);
