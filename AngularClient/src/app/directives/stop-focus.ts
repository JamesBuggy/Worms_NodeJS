import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: "[stop-focus]"
})
export class StopFocusDirective
{
    @HostListener("click", ["$event"])
    public onClick(event: any): void {
        console.log('StopFocusDirective');
        event.target.blur();
    }
}