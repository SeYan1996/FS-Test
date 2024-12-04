import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-ioredis';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CalculatorModule } from '@/modules/calculator/calculator.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: 'mongodb://localhost:27017/FSTest', //configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000, // 时间窗口，单位毫秒（这里是60秒）
        limit: 3, // 在时间窗口内允许的最大请求次数
      },
    ]),
    CalculatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
