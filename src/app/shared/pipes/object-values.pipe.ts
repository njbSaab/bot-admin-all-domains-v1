// src/app/shared/pipes/object-values.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectValues',
  pure: true
})
export class ObjectValuesPipe implements PipeTransform {
  transform(value: { [key: string]: any }): any[] {
    return Object.values(value);
  }
}