import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum } from 'class-validator';

export enum Operation {
  ADD = 'add',
  SUBTRACT = 'subtract',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
}

export class CalculateDto {
  @ApiProperty({ example: '1', description: 'number1' })
  @IsNumber()
  number1: number;

  @ApiProperty({ example: '1', description: 'number2' })
  @IsNumber()
  number2: number;

  @ApiProperty({ example: 'add', description: 'operation', enum: Operation })
  @IsEnum(Operation)
  operation: Operation;
}

export class CalculationInputs {
  @ApiProperty({
    example: 1,
    description: '第一个操作数',
  })
  number1: number;

  @ApiProperty({
    example: 2,
    description: '第二个操作数',
  })
  number2: number;
}

// response.dto.ts
export class CalculationResponseDto {
  @ApiProperty({
    example: 'success',
    description: '操作状态',
    enum: ['success', 'error'],
  })
  status: string;

  @ApiProperty({
    example: 'add',
    description: '执行的运算操作',
    enum: Operation,
  })
  operation: Operation;

  @ApiProperty({
    type: CalculationInputs,
    description: '计算输入值',
  })
  inputs: CalculationInputs;

  @ApiProperty({
    example: 3,
    description: '计算结果',
  })
  result: number;

  @ApiProperty({
    example: '2024-12-04T14:30:00.000Z',
    description: '计算执行时间戳',
  })
  timestamp: string;

  @ApiProperty({
    example: 5,
    description: '响应时间（毫秒）',
  })
  responseTime: number;
}
