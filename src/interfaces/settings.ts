import { ISearchEngine } from './search-engine';
import { ISelectedPrinter } from './selected-printer';
export interface ISearchEngine {
  name: string;
  url: string;
  keywordsUrl: string;
}

export interface IStartupBehavior {
  type: 'continue' | 'urls' | 'empty';
}

export interface ISettings {
  darkTheme: boolean;
  shield: boolean;
  multrin: boolean;
  animations: boolean;
  overlayBookmarks: boolean;
  suggestions: boolean;
  searchEngine: number;
  selectedPrinter: ISelectedPrinter[] | any[],
  searchEngines: ISearchEngine[];
  startupBehavior: IStartupBehavior;
}
