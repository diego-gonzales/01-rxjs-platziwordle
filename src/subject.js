import { Observable, Subject } from 'rxjs';

const myObservable$ = new Observable(subscriber => {
  subscriber.next(Math.round(Math.random() * 10));
});

const mySubject$ = new Subject();

const observer1 = {
  next: (value) => console.log(value)
};

const observer2 = {
  next: (value) => console.log(value)
};

mySubject$.subscribe(observer1);
mySubject$.subscribe(observer2);

myObservable$.subscribe(mySubject$);
mySubject$.next('ABC')