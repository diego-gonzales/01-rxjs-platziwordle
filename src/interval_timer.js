import { interval, timer } from 'rxjs';

const sequenceNumber$ = interval(1000);
const delayedTimer$ = timer(5000);

sequenceNumber$.subscribe(console.log);
delayedTimer$.subscribe(console.log);