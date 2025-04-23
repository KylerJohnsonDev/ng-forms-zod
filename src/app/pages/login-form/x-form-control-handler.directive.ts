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
    this.validateValue(eventTarget.value, this.xformControl());
  }

  @HostListener('focus')
  onFocus() {
    this.xformControl().focused.set(true);
  }

  @HostListener('blur')
  onBlur() {
    this.xformControl().touched.set(true);
  }

  private validateValue(value: string, formControlRef: XFormControl<string>): void {
    const schema = formControlRef.zodSchema ? formControlRef.zodSchema() : null
    if (!schema) {
      // if no schema, no validation required
      return;
    }
    const { success, error } = schema.safeParse(value);
    console.log(error?.errors.map(err => err.message))
    const errorMessages = Array<string>();
    if(!success) {
      // formControlRef.errors.set(error.errors.map(err => err.message));
      const errors = error.errors.map(zodIssue => zodIssue.message)
      for (const err of errors) {
        errorMessages.push(err);
      }
    }

    const validationDependencies = formControlRef.validationDependencies;
    if(validationDependencies && validationDependencies.length > 0) {
      for (const dep of validationDependencies) {
        const depSchema = dep.formControl.zodSchema ? dep.formControl.zodSchema() : null
        if (!depSchema) {
          // if no schema, no validation required
          return;
        }
        const { success, error } = depSchema.safeParse(value);
        if(!success) {
          // console.log(error?.errors.map(err => err.message))
          const errors = error.errors.map(zodIssue => zodIssue.message)
          for (const err of errors) {
            errorMessages.push(err);
          }
        }
      }
    }

  }
}
