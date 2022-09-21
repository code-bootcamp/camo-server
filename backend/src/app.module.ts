import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './apis/users/users.module';
import { ReviewsModule } from './apis/reviews/reviews.module';
import { PaymentsModule } from './apis/payments/payments.module';
import { CafeReservationsMoudule } from './apis/cafeReservations/cafeReservations.module';
import { Boardmodule } from './apis/boards/board.module';
import { AuthsModule } from './apis/auths/auths.module';
import { CafeListsModule } from './apis/cafeLists/cafeLists.module';
import { CommentsModule } from './apis/comments/comments.module';
import { FavoriteCafesModule } from './apis/favoreiteCafes/favoriteCafes.module';
import { FavoriteBoardsModule } from './apis/favoriteBoard/favoriteBoards.module';
import { ImageModule } from './apis/images/image.module';
import { TagsModule } from './apis/tags/tags.module';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { FileModule } from './apis/files/file.module';
import { ChatModule } from './apis/chat/chat.module';
import { CafeListImageModule } from './apis/cafeListImage/cafeListImages.module';
import { CafeListTagsModule } from './apis/cafeListTags/cafeListTags.module';
import { RolesGuard } from './commons/auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthsModule,
    Boardmodule,
    CafeListsModule,
    CafeReservationsMoudule,
    CafeListImageModule,
    CafeListTagsModule,
    CommentsModule,
    FavoriteCafesModule,
    FavoriteBoardsModule,
    FileModule,
    PaymentsModule,
    ReviewsModule,
    TagsModule,
    UsersModule,
    ChatModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credential: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
          'Access-Control-Allow-Headers',
          'Authorization',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
        origin: [
          'http://localhost:3000',
          'https://cafemoment.site',
          'https://cafemoment-backend.site',
        ],
        exposedHeaders: ['Set-Cookie', 'Cookie'],
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'], // 모델
      synchronize: true,
      logging: true,
      retryAttempts: 20,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
