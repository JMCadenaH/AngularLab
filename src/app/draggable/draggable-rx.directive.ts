import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, repeat, take } from 'rxjs/operators';

@Directive({
  selector: '[appDraggableRx]'
})
export class DraggableRxDirective implements OnInit {
  @HostBinding('class.draggable') draggable = true;
  @HostBinding('class.dragging') dragging = false;

  @Output() dragStart = new EventEmitter<PointerEvent>();
  @Output() dragMove = new EventEmitter<PointerEvent>();
  @Output() dragEnd = new EventEmitter<PointerEvent>();

  private pointerDown = new Subject<PointerEvent>();
  private pointerMove = new Subject<PointerEvent>();
  private pointerUp = new Subject<PointerEvent>();

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.pointerDown.next(event);
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    this.pointerMove.next(event);
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    this.pointerUp.next(event);
  }

  ngOnInit(): void {
    // stream of dragStart
    this.pointerDown.asObservable()
    .subscribe(event => {
      this.dragging = true;
      this.dragStart.emit(event);
    });

    // stream of dragMove
    this.pointerDown
      .pipe(
        switchMap(() => this.pointerMove),
        takeUntil(this.pointerUp),
        repeat()
      )
      .subscribe(event => this.dragMove.emit(event));

    // stream of dragEnd
    this.pointerDown
      .pipe(
        switchMap(() => this.pointerUp),
        take(1),
        repeat()
      )
      .subscribe(event => {
        this.dragging = false;
        this.dragEnd.emit(event);
      });

    // let's test ...
    // dragMove$.subscribe(() => console.log('got drag move'));
    // stream of dragStart
    // const dragStart$ = this.pointerDown.asObservable();
  }
}
