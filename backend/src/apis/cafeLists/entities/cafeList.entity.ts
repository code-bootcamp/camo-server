import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entites/user.entity';
import { CafeListTag } from 'src/apis/cafeListTags/entities/cafeListTag.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
  postalNumber: string;

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

  @JoinTable()
  @ManyToMany(() => CafeListTag, (cafeListTag) => cafeListTag.cafeList)
  @Field(() => [CafeListTag])
  cafeListTag: CafeList[];
}
