import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({
    example: 'success',
    description: 'success | error',
  })
  status: string;

  @ApiProperty({ description: 'The data of the response' })
  data?: T;

  @ApiProperty({ description: '<timestamp>' })
  timestamp?: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    example: 'success',
    description: 'success | error',
  })
  status: string;

  @ApiProperty({
    example: 'error message',
    description: 'Error message',
    required: false,
  })
  message?: string;

  @ApiProperty({ description: '<timestamp>' })
  timestamp?: string;
}

export class PaginationDto<T> {
  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ description: 'Total number of items', required: false })
  total?: number;

  @ApiProperty({
    description: '是否还有更多数据',
    required: false,
    type: Boolean,
  })
  hasMore?: Boolean;

  @ApiProperty({ isArray: true, description: 'List of items' })
  items: T[];
}
