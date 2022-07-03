import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 't-symbols',
  templateUrl: './t-symbols.component.html',
  styleUrls: ['./t-symbols.component.css'],
  providers: [NgbPopoverConfig],
})
export class TSymbolsComponent implements OnInit {
  turkSymbols = [
    { id: 1, sym: "&#304;", lsym: "&#305;", code: 305 },
    { id: 2, sym: "&#214;", lsym: "&#246;", code: 246 },
    { id: 3, sym: "&#220;", lsym: "&#252;", code: 252 },
    { id: 4, sym: "&#199;", lsym: "&#231;", code: 231 },
    { id: 5, sym: "&#286;", lsym: "&#287;", code: 287 },
    { id: 6, sym: "&#350;", lsym: "&#351;", code: 351 },
  ];

  @Output() symbolEmitter = new EventEmitter<number>();  

  constructor(config: NgbPopoverConfig) {
    config.placement = 'bottom-left';
    config.triggers = 'mouseenter';
    config.autoClose = 'outside';
  }

  ngOnInit(): void {
  }

  click(e: any) {
    let s = this.turkSymbols.find( el => el.id == e);
    if(s)
      this.symbolEmitter.emit(s['code']);
  }
}
