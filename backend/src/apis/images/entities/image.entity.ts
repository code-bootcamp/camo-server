import { Field } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { CafeList } from 'src/apis/cafeLists/entiteis/cafeList.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column()
  @Field(() => String)
  isMain: string;

  @ManyToOne(() => Board, { nullable: true })
  @Field(() => Board, { nullable: true })
  board: Board;

  @ManyToOne(() => CafeList, { nullable: true })
  @Field(() => CafeList, { nullable: true })
  cafeList: CafeList;
}
