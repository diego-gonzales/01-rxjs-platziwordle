import { map, filter, reduce } from 'rxjs/operators';
import { from } from 'rxjs';

const numbers$ = from([1, 2, 3, 4,5, 6, 7, 8, 9, 10]).pipe(
  map(x => x * 2),
  filter(x => x > 10),
  reduce((acc, x) => acc + x, 0)
);

numbers$.subscribe(console.log);