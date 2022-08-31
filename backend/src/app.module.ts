import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './apis/users/users.module';
import { ReviewsModule } from './apis/reviews/reviews.module';
import { PaymentsModule } from './apis/payments/payments.module';
import { CafeReservationsMoudule } from './apis/cafeReservations/cafeReservations.module';
import { CafeOwnersModule } from './apis/cafeOwners/cafeOwners.module';
import { ReviewsPointsMoudule } from './apis/reviewsPoints/reviewsPoints.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ReviewsModule,
    PaymentsModule,
    CafeReservationsMoudule,
    CafeOwnersModule,
    ReviewsPointsMoudule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
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
    }),
  ],
})
export class AppModule {}
