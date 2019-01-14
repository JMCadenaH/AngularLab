import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import {
  Overlay,
  OverlayRef,
  GlobalPositionStrategy
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Directive({
  selector: '[appDraggableHelper]',
  exportAs: 'appDraggableHelper'
})
export class DraggableHelperDirective implements OnInit, OnDestroy {
  private overlayRef: OverlayRef;
  private posititionStrategy = new GlobalPositionStrategy();
  private startPosition?: { x: number; y: number };
  constructor(
    private draggable: DraggableDirective,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay
  ) {}

  ngOnInit(): void {
    this.draggable.dragStart.subscribe(event => this.onDragStart(event));
    this.draggable.dragMove.subscribe(event => this.onDragMove(event));
    this.draggable.dragEnd.subscribe(() => this.onDragEnd());

    // Create an overlay ...
    this.overlayRef = this.overlay.create({
      positionStrategy: this.posititionStrategy,
      panelClass: 'draggable-helper-overlay'
    });
  }
  ngOnDestroy() {
    // remove the overlay ...
    this.overlayRef.dispose();
  }

  private onDragStart(event: PointerEvent): void {
    // determine relative start position
    const clientRect = this.draggable.element.nativeElement.getBoundingClientRect();
    this.startPosition = {
      x: event.clientX - clientRect.left,
      y: event.clientY - clientRect.top
    };
  }

  private onDragMove(event: PointerEvent): void {
    if (!this.overlayRef.hasAttached()) {
      // render the helper in the overlay
      // this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.overlayRef.attach(
        new TemplatePortal(this.templateRef, this.viewContainerRef)
      );
    }
    // Position the helper ...
    this.posititionStrategy.left(`${event.clientX - this.startPosition.x}px`);
    this.posititionStrategy.top(`${event.clientY - this.startPosition.y}px`);
    this.posititionStrategy.apply();
  }

  private onDragEnd(): void {
    // Remove the helper
    // this.viewContainerRef.clear();
    this.overlayRef.detach();
  }
}
