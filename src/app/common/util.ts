import { Observable } from "rxjs";

const apiEndpoint = "http://localhost:9000/api";

export function createHttpObservable(
  url: string,
  options = {}
): Observable<Object> {
  return new Observable((observer) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    options = {
      ...options,
      signal,
    };

    fetch(apiEndpoint + url, options)
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

    return () => abortController.abort();
  });
}
