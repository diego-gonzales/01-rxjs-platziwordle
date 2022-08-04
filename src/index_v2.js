import { fromEvent } from 'rxjs';

const onMouseClick$ = fromEvent(document, 'click');

const observerMouseEvent = {
  next: (value) => console.log(value),
  error: (err) => console.log('error: ', err),
  complete: () => console.log('complete')
};

onMouseClick$.subscribe(observerMouseEvent);