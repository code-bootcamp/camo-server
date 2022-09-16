import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entities/cafeList.entity';
import { User } from 'src/apis/users/entites/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class CafeReservation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  orderRequest: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  reservedPeople: number;

  @Column()
  @Field(() => Date)
  reservationDate: Date;

  @Column()
  @Field(() => String)
  startTime: string;

  @Column()
  @Field(() => String)
  endTime: string;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  reservationStatus: boolean;

  @ManyToOne(() => CafeList)
  @Field(() => CafeList)
  cafeList: CafeList;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
