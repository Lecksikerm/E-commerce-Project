import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  @IsArray()
  readonly data: T[];

  @ApiProperty()
  readonly total: number;

  constructor(data: T[], total: number) {
    this.total = total;
    this.data = data;
  }

}