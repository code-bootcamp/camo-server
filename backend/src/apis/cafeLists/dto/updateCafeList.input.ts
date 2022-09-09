import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBoardInput } from 'src/apis/boards/dto/createBoard.input';

@InputType()
export class UpdateCafeListInput extends PartialType(CreateBoardInput) {}
