import { Module } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { CalculatorController } from './calculator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Calculation, CalculationSchema } from './schemas/calculation.schema';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Calculation.name, schema: CalculationSchema },
    ]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [CalculatorController],
  providers: [CalculatorService],
})
export class CalculatorModule {}
