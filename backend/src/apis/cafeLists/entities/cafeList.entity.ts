import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tag } from 'src/apis/tags/entities/tag.entity';
import { User } from 'src/apis/users/entites/user.entity';
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
  @ManyToMany(() => Tag, (Tag) => Tag.cafeList)
  @Field(() => [Tag])
  tag: Tag[];
}
