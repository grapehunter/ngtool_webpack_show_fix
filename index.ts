import {
  Component,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
/// #if DEBUG
alert("Running in development mode!");
/// #else
alert("Running in production mode!");
/// #endif

@Component({
  selector: "app-root",
  standalone: true,
  /// #if DEBUG
  template: ` <h1>Hello from development!</h1> `,
  /// #else
  // @ts-ignore
  template: ` <h1>Hello from production!</h1> `,
  /// #endif
})
export class App {}

bootstrapApplication(App, {
  providers: [provideExperimentalZonelessChangeDetection()],
});
