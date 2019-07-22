import { observable } from 'mobx';
import { ipcRenderer, PrinterInfo } from 'electron';
import { writeFile, readFileSync } from 'fs';

import { ISettings } from '~/interfaces';
import { getPath } from '~/utils';
import { darkTheme, lightTheme } from '~/renderer/constants';
import { Store } from '.';
import { DEFAULT_SETTINGS } from '~/constants';
import { interceptReads } from 'mobx/lib/internal';
import { ISelectedPrinter } from '~/interfaces/selected-printer';
import console = require('console');

export type SettingsSection =
  | 'appearance'
  | 'autofill'
  | 'address-bar'
  | 'privacy'
  | 'permissions'
  | 'startup'
  | 'language'
  | 'shortcuts'
  | 'downloads'
  | 'system'
  | 'printer';

export class SettingsStore {
  @observable
  public selectedSection: SettingsSection = 'appearance';

  @observable
  public object: ISettings = DEFAULT_SETTINGS;

  @observable
  public listPrinter: PrinterInfo[] = [];

  constructor(private store: Store) {}

  public save() {
    ipcRenderer.send('settings', this.object);
    console.log(getPath('settings.json'));
    writeFile(getPath('settings.json'), JSON.stringify(this.object), err => {
      if (err) console.error(err);
    });
  }

  public load() {
    this.object = {
      ...this.object,
      ...JSON.parse(readFileSync(getPath('settings.json'), 'utf8')),
    };

    this.store.theme = this.object.darkTheme ? darkTheme : lightTheme;
    ipcRenderer.send('get-list-printer');
    ipcRenderer.on('list-printer-fetched',(e:any, printers: PrinterInfo[]) => {
      this.listPrinter = printers;
    })
    ipcRenderer.send('settings', this.object);
  }
}
