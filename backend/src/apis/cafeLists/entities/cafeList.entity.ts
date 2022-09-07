import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Review } from 'src/apis/reviews/entites/review.entity';
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
export class CafeList {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => String)
  startTime: string;

  @Column()
  @Field(() => String)
  endTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  homepage: string;

  @Column()
  @Field(() => Int)
  deposit: number;

  @Column()
  @Field(() => String)
  introduction: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @OneToOne(() => Review, { nullable: true })
  @Field(() => Review, { nullable: true })
  review: Review;
}
