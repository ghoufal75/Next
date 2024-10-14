import { NgModule } from "@angular/core";
import { LongPressDirective } from "./longPress.directive";

@NgModule({
  declarations : [LongPressDirective],
  exports : [LongPressDirective],
})
export class LongPressModule{}
