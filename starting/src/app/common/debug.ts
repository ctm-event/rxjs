import { tap } from 'rxjs/operators';
import { Observable } from "rxjs";

export enum RxJsLogginfLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let rxjsLoggingLevel: RxJsLogginfLevel = RxJsLogginfLevel.INFO;

export const setDebugLogginLevel = (level: RxJsLogginfLevel) => rxjsLoggingLevel = level;

export const debug =
  (level: number, message: string = 'Message') => (source: Observable<any>) => source
    .pipe(tap((val) => {
      if (rxjsLoggingLevel >= level) {
        console.log(`${message}: ${val}`);
      }
    }));


