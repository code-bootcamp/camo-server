import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCafeListInput } from './createCafeList.input';

@InputType()
export class UpdateCafeListInput extends PartialType(CreateCafeListInput) {}
