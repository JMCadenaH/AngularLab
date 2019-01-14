import {
  Directive,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Output,
  EventEmitter
} from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { SortableDirective } from './sortable.directive';
import { createDirectiveInstance } from '@angular/core/src/view/provider';

export interface SortEvent {
  currentIndex: number;
  newIndex: number;
}
const distance = (rectA: ClientRect, rectB: ClientRect): number => {
  return Math.sqrt(
    Math.pow(rectB.top - rectA.top, 2) + Math.pow(rectB.left - rectA.left, 2)
  );
};

@Directive({
  selector: '[appSortableList]'
})
export class SortableListDirective implements AfterContentInit {
  @ContentChildren(SortableDirective) sortables: QueryList<SortableDirective>;

  @Output() sort = new EventEmitter<SortEvent>();

  private clientRects: ClientRect[];

  ngAfterContentInit(): void {
    this.sortables.forEach(sortable => {
      sortable.dragStart.subscribe(() => this.measureClienteRects());
      sortable.dragMove.subscribe(event => this.detectSorting(sortable, event));
    });
  }

  private measureClienteRects() {
    this.clientRects = this.sortables.map(sortable =>
      sortable.element.nativeElement.getBoundingClientRect()
    );
  }

  private detectSorting(sortable: SortableDirective, event: PointerEvent) {
    // get all the client rects
    // sort the by distance to current sortable

    const currentIndex = this.sortables.toArray().indexOf(sortable);
    const currentRect = this.clientRects[currentIndex];

    const sorted = this.clientRects
      .slice()
      .sort(
        (rectA, rectB) => distance(rectA, currentRect) - distance(rectB, currentRect)
      )
      .some(rect => {
        // find first rect that we need to swap with
        if (rect === currentRect) {
          return false;
        }

        const isHorizontal = rect.top === currentRect.top;
        const isBefore = isHorizontal
          ? rect.left < currentRect.left
          : rect.top < currentRect.top;

        let moveBack = false;
        let moveForward = false;

        if (isHorizontal) {
          moveBack = isBefore && event.clientX < rect.left + rect.width / 2;
          moveForward = !isBefore && event.clientX > rect.left + rect.width / 2;
        } else {
          moveBack = isBefore && event.clientY < rect.top + rect.height / 2;
          moveForward = !isBefore && event.clientY > rect.top + rect.height / 2;
        }

        if (moveBack || moveForward) {
          this.sort.emit({
            currentIndex: currentIndex,
            newIndex: this.clientRects.indexOf(rect)
          });

          return true;
        }

        return false;
        // stop
      });

    // console.log(sorted.map(r => [r.left, r.top]));
  }
}
