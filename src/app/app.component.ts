import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      display: flex;
      flex-direction: column;

      main {
        flex: 1;
      }
    }
  `
})
export class AppComponent {

}
