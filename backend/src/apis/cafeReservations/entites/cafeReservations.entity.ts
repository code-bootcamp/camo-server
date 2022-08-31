import { Field, ObjectType } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entiteis/cafeList.entity';
import { CafeOwner } from 'src/apis/cafeOwners/entites/cafeOwner.entity';
import { Payment } from 'src/apis/payments/entities/payment.entity';
import { ReviewPoint } from 'src/apis/reviewsPoints/entites/reviewPoint.entity';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

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

  @ManyToOne(() => CafeList)
  @Field(() => CafeList)
  cafeList: CafeList;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @OneToOne(() => CafeOwner)
  @Field(() => CafeOwner)
  cafeOwner: CafeOwner;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;

  @JoinColumn()
  @OneToOne(() => ReviewPoint, { nullable: true })
  @Field(() => ReviewPoint, { nullable: true })
  reviewPoint: ReviewPoint;
}
