import { Component, OnDestroy, OnInit } from "@angular/core";
import { concat, interval, merge, noop, of, Subscription } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable('/courses');

    const httpSubscription = http$.subscribe();

    setTimeout(() => {
      httpSubscription.unsubscribe();
    }, 0);

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
