import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';

@Entity()
@ObjectType()
export class BoardTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(() => Board, (board) => board.tag)
  @Field(() => [Board])
  board: Board[];
}
