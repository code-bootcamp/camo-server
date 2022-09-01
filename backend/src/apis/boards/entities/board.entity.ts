import { Field, ObjectType } from '@nestjs/graphql';
import { BoardTag } from 'src/apis/tags/tag.entity';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  DeleteDateColumn,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => String)
  adress: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  likeCount: string;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @JoinTable()
  @ManyToMany(() => BoardTag, (boardTag) => boardTag.board, { nullable: true })
  @Field(() => [BoardTag], { nullable: true })
  tag: BoardTag[];

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
