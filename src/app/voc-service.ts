import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class VocService {

  words = new Subject<any[]>();
  translation = new Subject<any>();

  constructor() {
    electron.ipcRenderer.on('getWordsListResponse', (event: any, words: any) => {
      this.words.next(words);
    });
    electron.ipcRenderer.on('getTranslationResponse', (event: any, translation: any) => {
      this.translation.next(translation);
    });
  }

  getWordsList(search: string, isFullSearch: boolean, activeLanguage: string, offset: number) {
    electron.ipcRenderer.send('getWordsList', search, isFullSearch, activeLanguage, offset);
  }

  getTranslation(refId: number) {
    electron.ipcRenderer.send('getTranslation', refId);
  }
}

