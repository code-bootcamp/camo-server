import { Field, ObjectType } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entities/cafeList.entity';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class FavoriteCafe {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  status: string;

  @JoinTable()
  @ManyToOne(() => CafeList)
  @Field(() => CafeList)
  cafeList: CafeList;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
