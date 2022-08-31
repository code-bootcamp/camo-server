import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PAYMENT_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
} // 실제 enum

registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'POINT_TRANSACTION_STATUS_ENUM',
}); // graphql로 등록

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @CreateDateColumn()
  @Field(() => Date)
  paymentDate: Date;

  @Column()
  @Field(() => Int)
  paymentAmount: number;

  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
  @Field(() => PAYMENT_STATUS_ENUM)
  status: string;
}
