import { Component, OnDestroy, OnInit } from "@angular/core";
import { concat, interval, noop, of, Subscription } from "rxjs";
import { map } from "rxjs/operators";
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
    const neverComplete$ = interval(1000);
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);

    const result$ = concat(neverComplete$, source1$, source2$, source3$);
    const resultSubscription = result$.subscribe(val => console.log(val));

    this.subscriptions.add(resultSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
