import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  isMain: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Board, (board) => board.images)
  @Field(() => Board)
  board: Board;
}
