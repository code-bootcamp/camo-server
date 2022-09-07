import { Field, ObjectType } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entities/cafeList.entity';
import { CafeOwner } from 'src/apis/cafeOwners/entities/cafeOwner.entity';
import { Payment } from 'src/apis/payments/entities/payment.entity';
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
export class CafeReservation {
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
}
