import { Observable } from "rxjs";

const apiEndpoint = "/api";

export function createHttpObservable<T extends Object>(
  url: string,
  options = {}
): Observable<T> {
  return new Observable((observer) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    options = {
      ...options,
      signal,
    };

    fetch(apiEndpoint + url, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        observer.error(response.status);
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });

    return () => abortController.abort();
  });
}
