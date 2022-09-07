import { Field, ObjectType } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entities/cafeList.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';

@Entity()
@ObjectType()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(() => Board, (board) => board.tag)
  @Field(() => [Board])
  board: Board[];

  @ManyToMany(() => CafeList, (cafeList) => cafeList.tag)
  @Field(() => [CafeList])
  cafeList: CafeList[];
}
