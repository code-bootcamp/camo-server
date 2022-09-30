import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FreeBoard } from '../../freeboards/entities/freeBoard.entity';

@Entity()
@ObjectType()
export class FreeBoardTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(() => FreeBoard, (freeBoard) => freeBoard.tags)
  @Field(() => [FreeBoard])
  freeBoard: FreeBoard[];
}
