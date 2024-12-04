import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CalculateDto, Operation } from './dto/calculate.dto';
import { Calculation, CalculationDocument } from './schemas/calculation.schema';

@Injectable()
export class CalculatorService {
  constructor(
    @InjectModel(Calculation.name)
    private calculationModel: Model<CalculationDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async calculate(calculateDto: CalculateDto): Promise<any> {
    const startTime = Date.now();

    // 检查缓存
    const cacheKey = `${calculateDto.operation}_${calculateDto.number1}_${calculateDto.number2}`;
    const cachedResult = await this.cacheManager.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    // 执行计算
    let result: number;
    switch (calculateDto.operation) {
      case Operation.ADD:
        result = calculateDto.number1 + calculateDto.number2;
        break;
      case Operation.SUBTRACT:
        result = calculateDto.number1 - calculateDto.number2;
        break;
      case Operation.MULTIPLY:
        result = calculateDto.number1 * calculateDto.number2;
        break;
      case Operation.DIVIDE:
        if (calculateDto.number2 === 0) {
          throw new BadRequestException('Division by zero is not allowed');
        }
        result = calculateDto.number1 / calculateDto.number2;
        break;
    }

    const responseTime = Date.now() - startTime;

    // 保存到数据库
    const calculation = new this.calculationModel({
      operation: calculateDto.operation,
      inputs: [calculateDto.number1, calculateDto.number2],
      result,
      responseTime,
    });
    await calculation.save();

    // 设置缓存
    const response = {
      status: 'success',
      operation: calculateDto.operation,
      inputs: {
        number1: calculateDto.number1,
        number2: calculateDto.number2,
      },
      result,
      timestamp: new Date().toISOString(),
      responseTime,
    };

    await this.cacheManager.set(cacheKey, response, 60000); // 60秒缓存

    return response;
  }
}
