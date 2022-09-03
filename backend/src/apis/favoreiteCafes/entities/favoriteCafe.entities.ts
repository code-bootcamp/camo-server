import { Field } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entiteis/cafeList.entity';
import { User } from 'src/apis/users/entites/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  status: string;

  @ManyToOne(() => CafeList)
  @Field(() => CafeList)
  board: CafeList;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => CafeList)
  @Field(() => CafeList)
  cafeList: CafeList;
}
