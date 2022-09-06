import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entites/user.entity';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  comment: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column()
  @Field(() => String)
  status: string;

  // @ManyToMany(() => Board, (board) => board.comment) // nullable 추가? 왜?
  @ManyToOne(() => Board)
  @Field(() => Board)
  board: Board;

  // @ManyToMany(() => User, (user) => user.comment)
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
