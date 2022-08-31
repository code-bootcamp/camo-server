import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CafeReservaion {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  orderRequest: string;

  @Column()
  @Field(() => Date)
  reservationTime: Date;

  @Column()
  @Field(() => Date)
  reservationDate: Date;

  @Column()
  @Field(() => Boolean)
  reservationStatus: boolean;
}
