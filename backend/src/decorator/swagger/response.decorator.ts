import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationDto, ResponseDto } from './dto/response.dto';

// 分页返回装饰器
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto, PaginationDto, model),
    ApiResponse({
      status: '2XX',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PaginationDto) },
                  {
                    properties: {
                      items: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};

// 对象返回装饰器
export const ApiObjectResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto, model),
    ApiResponse({
      status: '2XX',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

// 列表返回装饰器
export const ApiListResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto, model),
    ApiResponse({
      status: '2XX',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { type: 'array', items: { $ref: getSchemaPath(model) } },
            },
          },
        ],
      },
    }),
  );
};

// 无内容返回装饰器
export const ApiEmptyResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: '2XX',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {},
          },
        ],
      },
    }),
  );
};
