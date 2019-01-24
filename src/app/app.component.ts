import { Component } from '@angular/core';
import { SortEvent } from './draggable/sortable-list.directive';

function remove(item: string, list: string[]) {
  if (list.indexOf(item) !== -1) {
    list.splice(list.indexOf(item), 1);
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  trappedBoxes = ['Trapped 1', 'Trapped 2'];

  sortableList = [
    'Box 1',
    'Box 2',
    'Box 3',
    'Box 4',
    'Box 5',
    'Box 6',
    'Box 7',
    'Box 8',
    'Box 9',
    'Box 10',
    'Box 11',
    'Box 12'
  ];

  avalilableBoxes = ['Box 1', 'Box 2', 'Box 3', 'Box 4', 'Box 5'];

  dropzone1 = ['Box 6'];

  dropzone2 = ['Box 7'];

  currentBox?: string;

  add(): void {
    this.trappedBoxes.push('New Trapped');
    this.sortableList.push('13');
  }

  sort(event: SortEvent) {
    const current = this.sortableList[event.currentIndex];
    const swapWith = this.sortableList[event.newIndex];

    this.sortableList[event.newIndex] = current;
    this.sortableList[event.currentIndex] = swapWith;
  }

  move(box: string, toList: string[]) {

    remove(box, this.avalilableBoxes);
    remove(box, this.dropzone1);
    remove(box, this.dropzone2);

    toList.push(box);
  }
}
