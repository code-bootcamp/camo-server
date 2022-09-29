import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entites/user.entity';
import { CafeListTag } from 'src/apis/cafeListTags/entities/cafeListTag.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Review } from 'src/apis/reviews/entites/review.entity';
import { CafeListImage } from 'src/apis/cafeListImage/entities/cafeListImage.entity';
import { FavoriteCafe } from 'src/apis/favoreiteCafes/entities/favoriteCafe.entity';
import { CafeReservation } from 'src/apis/cafeReservations/entities/cafeReservations.entity';

@Entity()
@ObjectType()
export class CafeBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  address: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  addressDetail: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phone: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  startTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  endTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  homepage: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  deposit: number;

  @Column()
  @Field(() => String)
  contents: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  remarks: string;

  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  user: User;

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  favoriteCafeCount: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @JoinTable()
  @ManyToMany(() => CafeListTag, (cafeListTag) => cafeListTag.cafeBoard, {
    nullable: true,
  })
  @Field(() => [CafeListTag], { nullable: true })
  cafeListTag: CafeListTag[];

  @OneToMany(() => Review, (review) => review.cafeBoard, { nullable: true })
  @Field(() => [Review], { nullable: true })
  reviews: Review[];

  @JoinTable()
  @OneToMany(() => FavoriteCafe, (favoriteCafe) => favoriteCafe.cafeBoard, {
    nullable: true,
  })
  @Field(() => [FavoriteCafe], { nullable: true })
  favoriteCafe: FavoriteCafe[];

  @JoinTable()
  @OneToMany(() => CafeListImage, (cafeListImage) => cafeListImage.cafeBoard, {
    nullable: true,
  })
  @Field(() => [CafeListImage], { nullable: true })
  cafeListImage: CafeListImage[];

  @JoinTable()
  @OneToMany(
    () => CafeReservation,
    (cafeReservation) => cafeReservation.cafeBoard,
    {
      nullable: true,
    },
  )
  @Field(() => [CafeReservation], { nullable: true })
  cafeReservation: CafeReservation[];
}
