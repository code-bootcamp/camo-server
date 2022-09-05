import { Field, ObjectType } from '@nestjs/graphql';
import { CafeOwner } from 'src/apis/cafeOwners/entities/cafeOwner.entity';
import { CafeReservation } from 'src/apis/cafeReservations/entities/cafeReservations.entity';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  reviewComment: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  ownerComment: string;

  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @OneToOne(() => CafeOwner, { nullable: true })
  @Field(() => CafeOwner, { nullable: true })
  cafeOwner: CafeOwner;

  @ManyToOne(() => CafeReservation, { nullable: true })
  @Field(() => CafeReservation, { nullable: true })
  cafeReservation: CafeReservation;
}
