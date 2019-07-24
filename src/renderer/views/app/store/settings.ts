import { observable } from 'mobx';
import { ipcRenderer, PrinterInfo } from 'electron';
import { writeFile, promises } from 'fs';
import { ISettings } from '~/interfaces';
import { getPath, makeId } from '~/utils';
import { darkTheme, lightTheme } from '~/renderer/constants';
import { Store } from '.';
import { DEFAULT_SETTINGS } from '~/constants';
import console = require('console');
import { EventEmitter } from 'events';

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

export class SettingsStore extends EventEmitter {
  @observable
  public selectedSection: SettingsSection = 'appearance';

  @observable
  public object: ISettings = DEFAULT_SETTINGS;

  @observable
  public listPrinter: PrinterInfo[] = [];

  private queue: any[] = [];

  constructor(private store: Store) {
    super();
    this.load();
  }

  public async save() {
    ipcRenderer.send('settings', this.object);
    
    const id = makeId(32);

    this.queue.push(id);

    const exec = async () => {
      try {
        await promises.writeFile(
          getPath('settings.json'),
          JSON.stringify(this.object),
        );
        this.queue.splice(0, 1);
        this.emit(`queue-${this.queue[0]}`);
      } catch (e) {
        console.error(e);
      }
    };
    if (this.queue.length === 1) {
      exec();
    } else {
      this.once(`queue-${id}`, () => {
        exec();
      });
    }
  }

  public async load() {
    try {
      const file = await promises.readFile(getPath('settings.json'), 'utf8');

      this.object = {
        ...this.object,
        ...JSON.parse(file),
      };

      this.store.theme = this.object.darkTheme ? darkTheme : lightTheme;
      ipcRenderer.send('get-list-printer');
      ipcRenderer.on('list-printer-fetched', (e: any, printers: PrinterInfo[]) => {
        this.listPrinter = printers;
      })
      ipcRenderer.send('settings', this.object);
    } catch (e) {
      console.error(e);
    }
  }
}
