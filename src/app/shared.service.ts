import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from './board';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$: Observable<any> = this.dataSubject.asObservable();

  private localeSubject = new BehaviorSubject<string>("");
  locale$: Observable<string> = this.localeSubject.asObservable();

  private manageBoardListSubject = new BehaviorSubject<Board[]>([]);
  manageBoardList$: Observable<Board[]> = this.manageBoardListSubject.asObservable();

  constructor() {}

  setData(value: any): void {
    this.dataSubject.next(value);
  }

  getData(): Observable<any> {
    return this.data$;
  }

  setLocale(value: any): void {
    this.localeSubject.next(value);
  }

  getLocale(): Observable<any> {
    return this.locale$;
  }

  setManageBoardList(value: any): void {
    this.manageBoardListSubject.next(value);
  }

  getManageBoardList(): Observable<any> {
    return this.manageBoardList$;
  }


}