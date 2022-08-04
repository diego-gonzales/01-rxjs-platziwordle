import { from, of, asyncScheduler } from 'rxjs';

const fruits$ = from(['apple', 'banana', 'grape', 'orange'], asyncScheduler);

fruits$.subscribe(console.log);