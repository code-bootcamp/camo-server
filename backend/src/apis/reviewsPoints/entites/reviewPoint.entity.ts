import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ReviewPoint {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  option1: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  option2: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  option3: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  option4: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  option5: number;
}
