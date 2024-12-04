import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CalculatorService } from './calculator.service';
import { CalculateDto, CalculationResponseDto } from './dto/calculate.dto';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { ErrorResponseDto } from '@/decorator/swagger/dto/response.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('calculator')
@Controller('calculator')
@UseInterceptors(TransformInterceptor)
@UseGuards(ThrottlerGuard)
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Perform calculation' })
  @ApiResponse({
    status: 201,
    description: 'succsss',
    type: CalculationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    type: ErrorResponseDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async calculate(@Body() calculateDto: CalculateDto) {
    return this.calculatorService.calculate(calculateDto);
  }
}
