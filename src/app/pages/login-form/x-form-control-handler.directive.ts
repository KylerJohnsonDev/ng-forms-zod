import { Directive, HostListener, input } from "@angular/core";
import { XFormControl } from "./validation";


@Directive({
  selector: '[xFormControlHandler]',
})
export class XFormControlHandlerDirective {
  xformControl = input.required<XFormControl<string>>();

  @HostListener('input')
  onInput() {
    this.xformControl().dirty.set(true);
    this.xformControl().pristine.set(false);
  }

  @HostListener('focus')
  onFocus() {
    this.xformControl().focused.set(true);
  }

  @HostListener('blur')
  onBlur() {
    this.xformControl().touched.set(true);
  }
}
