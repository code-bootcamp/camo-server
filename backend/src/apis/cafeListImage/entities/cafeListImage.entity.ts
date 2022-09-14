import { Field, ObjectType } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entities/cafeList.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CafeListImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  isMain: string;

  @DeleteDateColumn({ nullable: true })
  @Field(() => String, { nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CafeList, {
    nullable: true,
    orphanedRowAction: 'soft-delete',
  })
  @Field(() => CafeList, { nullable: true })
  cafeList: CafeList;
}
