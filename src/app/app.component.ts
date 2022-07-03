import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Directive, HostListener } from '@angular/core';
import { VocService } from './voc-service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('searchInput') searchInput: any;
  @ViewChild("wordsList") wordsList: any;
  neWordsList: HTMLElement | undefined;
  title = 'TurkVoc';
  words: any[] = [];
  translation = '';
  card: string;
  isFullSearch = false;
  activeLanguage = 'tr';
  searchVal = '';
  isScrollingContinue = false;

  constructor(private vocService: VocService, private cdr: ChangeDetectorRef) { 
    this.card = '';
  }

  ngOnInit() {
    this.vocService.words.subscribe((value) => {
      if(this.isScrollingContinue) {
        this.words = this.words.concat(value);
        this.isScrollingContinue = false;
      } else {
        this.words = value;  
      }
      
      if(this.words.length > 0) {
        this.card = this.words[0]['value'];
        this.vocService.getTranslation(this.words[0].id);
      } else {
        this.card = '';
        this.translation = '';
      }
      this.cdr.detectChanges();
    });
    this.vocService.getWordsList('', false, this.activeLanguage, 0);
    
    this.vocService.translation.subscribe((value: any) => {
      this.translation = value.dataValues.desc_ru;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.searchInput.nativeElement.value = '';
    let that = this;
    this.neWordsList = (<HTMLElement> this.wordsList.nativeElement);
    let st: number;
    let sh: number;
    let oh: number;
    this.neWordsList.onscroll = function(e) {
      st = (<HTMLElement> that.wordsList.nativeElement).scrollTop;
      sh = (<HTMLElement> that.wordsList.nativeElement).scrollHeight;
      oh = (<HTMLElement> that.wordsList.nativeElement).offsetHeight;
      if(oh + st == sh) {
        that.isScrollingContinue = true;
        that.vocService.getWordsList(that.searchVal, that.isFullSearch, that.activeLanguage, that.words.length);
      }
    }
 }

  fullSearch(e: any) {
    if (e.target.checked) {
      this.isFullSearch = true;
    } else {
      this.isFullSearch = false;
    }
    this.searchVal = this.searchInput.nativeElement.value;
    this.vocService.getWordsList(this.searchVal, this.isFullSearch, this.activeLanguage, 0);
  }

  showCard(e: any) {
    this.card = e.value;
    this.vocService.getTranslation(e.id);
  }

  search(event: KeyboardEvent) {
    this.searchVal = (event.target as HTMLInputElement).value;
    if(event.code == "Escape") {
      this.searchInput.nativeElement.value = '';
      this.vocService.getWordsList('', false, this.activeLanguage, 0);
    } else {
      this.vocService.getWordsList(this.searchVal, this.isFullSearch, this.activeLanguage, 0);
    }
  }

  turkSymbol($event: number) {
    this.searchInput.nativeElement.value += String.fromCharCode($event);;
    this.searchVal = this.searchInput.nativeElement.value;
    this.searchInput.nativeElement.focus();
    this.vocService.getWordsList(this.searchVal, this.isFullSearch, this.activeLanguage, 0);
  }
}


