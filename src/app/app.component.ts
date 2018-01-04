import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <github-fork-us></github-fork-us>
    <launch-from-s4s></launch-from-s4s>
    <header></header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
}
