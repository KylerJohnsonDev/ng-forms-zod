import { Directive, HostListener, input, Signal } from "@angular/core";
import { XFormControl } from "./validation";
import { ZodSchema } from "zod";


@Directive({
  selector: '[xFormControlHandler]',
})
export class XFormControlHandlerDirective {
  xformControl = input.required<XFormControl<string>>();

  @HostListener('input', ['$event.target'])
  onInput(eventTarget: HTMLInputElement) {
    this.xformControl().value.set(eventTarget.value)
    this.xformControl().dirty.set(true);
    this.xformControl().pristine.set(false);
    this.validateValueAgainstSchema(eventTarget.value, this.xformControl());
  }

  @HostListener('focus')
  onFocus() {
    this.xformControl().focused.set(true);
  }

  @HostListener('blur')
  onBlur() {
    this.xformControl().touched.set(true);
  }

  private validateValueAgainstSchema(value: string, formControlRef: XFormControl<string>): void {
    const schema = formControlRef.zodSchema ? formControlRef.zodSchema() : null
    if (!schema) {
      // if no schema, no validation required
      return;
    }
    const { success, error } = schema.safeParse(value);
    console.log(error?.errors.map(err => err.message))
    if(!success) {
      formControlRef.errors.set(error.errors.map(err => err.message));
    }
  }
}
