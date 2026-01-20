import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByLanding',
  pure: true,
  standalone: false  
})
export class FilterByLandingPipe implements PipeTransform {
 transform(quizzes: any[] | null, landingId: number | null): any[] {
    if (!quizzes || landingId === null) return [];
    return quizzes.filter(q => q.landingId === landingId);
  }
}
