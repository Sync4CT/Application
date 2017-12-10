import {Component} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: "header",
  template: `
    <div id="greyBackground"></div>

    <div id="container">
      <img src="/assets/S4CTWhiteLogo.png">

      <div id="routingOptions">
        <div class="routeOption {{currentRoute === '/home' ? 'selectedRoute' : 'unselectedRoute'}}" (click)="routeTo('home')">
          <p>About</p>
        </div>
        <div class="routeOption {{currentRoute === '/ehr-link' ? 'selectedRoute' : 'unselectedRoute'}}" (click)="routeTo('ehr-link')">
          <p>EHR Link</p>
        </div>
        <div style="width: 1px; height: 76px; float: left; background-color: #a4a4a4; margin: 2px 3px;">
        </div>
        <div class="routeOption {{currentRoute === '/app' ? 'selectedRoute' : 'unselectedRoute'}}"
             (click)="routeTo('app');">
          <p>Try It Out!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    p {
      margin: 0;
    }

    #greyBackground {
      width: 100vw;
      height: 100vh;
      background-color: rgba(17, 17, 17, 0.96);
      position: fixed;
      z-index: -50;
    }

    #container {
      background-color: #2f2f2f;
      width: 100%;

      padding-left: 30px;

      box-shadow: 0 2px 4px #1f1f1f;

      overflow: hidden;
    }

    #container img {
      height: 70px;
      width: auto;
      margin-top: 5px;
      margin-bottom: 5px;
      float: left;
    }

    #routingOptions {
      min-width: 300px;
      height: 100%;
      overflow: hidden;
      float: right;
    }

    .routeOption {
      float: left;
      color: #2f2f2f;

      text-align: center;
      height: 60px;
      width: calc(100% / 3 - 9px); /* +1 px for each for border div */
      margin: 10px 3px;

      display: flex;
      justify-content: center;
      align-items: center;

      cursor: default;
      border-radius: 5px;
    }

    .unselectedRoute {
      background-color: #2f2f2f;
      color: white;
    }

    .unselectedRoute:hover {
      background-color: #292929;
    }

    .unselectedRoute:active {
      background-color: #3c3c3c;
    }

    .selectedRoute {
      background-color: #adadad;
      color: black;
    }
  `]
})
export class HeaderComponent {
  constructor (private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentRoute = val.urlAfterRedirects;
      }
    });
  }

  currentRoute: string = "/app";

  routeTo(routeLoc: string) {
    this.router.navigate([routeLoc]);
  }
}
