import { Observable } from 'rxjs';

const myObservable$ = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  // subscriber.complete();
  subscriber.next(3);
  subscriber.next(20);
  subscriber.next('Curso de RxJS');
  a = b;
  subscriber.next({ name: 'RxJS' });
});

const myObserver = {
  next: value => console.log(value),
  error: error => console.error(error),
  complete: () => console.log('complete')
};

myObservable$.subscribe(myObserver);