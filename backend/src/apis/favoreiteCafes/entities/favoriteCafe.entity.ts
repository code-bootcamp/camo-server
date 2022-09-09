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

  @Column({ default: false })
  @Field(() => Boolean)
  isLike: boolean;

  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  user: User;

  @JoinTable()
  @ManyToOne(() => CafeList, { nullable: true })
  @Field(() => CafeList, { nullable: true })
  cafeList: CafeList;
}
