import {
  Directive,
  OnInit,
  HostBinding,
  HostListener,
  Output,
  EventEmitter,
  SkipSelf,
  ElementRef
} from '@angular/core';
import { DroppableService } from './droppable.service';

@Directive({
  selector: '[appDropzone]',
  providers: [DroppableService]
})
export class DropzoneDirective implements OnInit {
  @HostBinding('class.dropzone-activated') activated = false;
  @HostBinding('class.dropzone-entered') entered = false;

  @Output() drop = new EventEmitter<PointerEvent>();
  @Output() remove = new EventEmitter<PointerEvent>();

  private clientRect: ClientRect;

  constructor(
    @SkipSelf() private allDroppableService: DroppableService,
    private ownDroppableService: DroppableService,
    private element: ElementRef
  ) {}

  ngOnInit(): void {
    this.allDroppableService.dragStart$.subscribe(() => this.onDragStart());
    this.allDroppableService.dragEnd$.subscribe(event => this.onDragEnd(event));

    this.allDroppableService.dragMove$.subscribe(event => {
      if (this.isEventInside(event)) {
        this.onPointerEnter();
      } else {
        this.onPointerLeave();
      }
    });

    this.ownDroppableService.dragStart$.subscribe(() =>
      this.onInnerDragStart()
    );
    this.ownDroppableService.dragEnd$.subscribe(event =>
      this.onInnerDragEnd(event)
    );
  }

  private isEventInside(event: PointerEvent): any {
    return (
      event.clientX >= this.clientRect.left &&
      event.clientX <= this.clientRect.right &&
      event.clientY >= this.clientRect.top &&
      event.clientX <= this.clientRect.bottom
    );
  }

  private onInnerDragStart(): void {
    this.activated = true;
    this.entered = true;
  }

  private onInnerDragEnd(event: PointerEvent): void {
    if (!this.entered) {
      this.remove.emit(event);
    }

    this.activated = false;
    this.entered = false;
  }

  private onPointerEnter(): void {
    if (!this.activated) {
      return;
    }

    this.entered = true;
  }

  private onPointerLeave(): void {
    if (!this.activated) {
      return;
    }
    this.entered = false;
  }

  private onDragStart(): void {
    this.clientRect = this.element.nativeElement.getBoundingClientRect();
    this.activated = true;
  }

  private onDragEnd(event: PointerEvent): void {
    if (!this.activated) {
      return;
    }

    if (this.entered) {
      // we have a drop!
      // console.log('drop!');
      this.drop.emit(event);
    }
    this.activated = false;
    this.entered = false;
  }
}
