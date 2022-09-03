import { Observable } from "rxjs";

const apiEndpoint = 'http://localhost:9000/api'

export function createHttpObservable(url: string): Observable<Object> {
   return new Observable((observer) => {
     fetch(apiEndpoint + url)
       .then((response) => {
         return response.json();
       })
       .then((body) => {
         observer.next(body);
         observer.complete();
       })
       .catch((error) => {
         observer.error(error);
       });
   });
}
