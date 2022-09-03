import { Field, ObjectType } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entities/cafeList.entity';
import { Review } from 'src/apis/reviews/entites/review.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CafeOwner {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  phoneNumber: string;

  @CreateDateColumn()
  @Field(() => Date)
  signupDate: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @JoinTable()
  @OneToOne(() => Review, { nullable: true })
  @Field(() => Review, { nullable: true })
  review: Review;

  @JoinColumn()
  @OneToOne(() => CafeList, { nullable: true })
  @Field(() => CafeList, { nullable: true })
  cafeList: CafeList;

  @JoinColumn()
  @OneToOne(() => CafeOwner, { nullable: true })
  @Field(() => CafeOwner, { nullable: true })
  cafeOwner: CafeOwner;
}
