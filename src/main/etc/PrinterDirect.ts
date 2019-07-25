import { ipcMain, app } from 'electron';
import { observable } from 'mobx';
import { AppWindow } from '../windows';
import * as os from 'os';
import * as path from 'path';
import Axios from 'axios';
import console = require('console');
import { ISettings, ISelectedPrinter } from '~/interfaces';
import { settings } from '..';
import util from 'util'
import { createWriteStream } from 'fs';
import * as nodejre from 'node-jre';
import { parse } from 'url';

export interface IPrintData {
  file : string,
  copies: string,
  printer_use : string
}
export class PrintDirect{
  @observable
  protected appWindow: AppWindow;


  
  constructor(appWindow: AppWindow, settings: ISettings){
    this.appWindow = appWindow;
  }
  listenSettingFetchPrinter() {
    ipcMain.on('get-list-printer', (e: any) => {
      if (this.appWindow) {
        e.sender.send('list-printer-fetched', this.appWindow.webContents.getPrinters());
        this.appWindow.webContents
      }
    });
  }

  listenFileToPrint(){
      ipcMain.on('print-file-direct', (event, arg) => {
        const selectedPrinter = settings.selectedPrinter;
        
        arg.map((data) => {
          let printerUse = Object.values(selectedPrinter).find((item) => {
            return item.usedFor == data.printer_use
          });
          let filename = path.basename(parse(data.file).pathname);
          if(!printerUse){
            return event.reply('printer-not-setted', filename);
          }

          let filePath = path.join(os.tmpdir(), filename);
          let printerName =  printerUse.name;
          let stream = createWriteStream(filePath);
          event.reply('print-file-downloaded', filePath);
          Axios.get(data.file,{
            responseType: 'stream'
          }).then((response) => {
            response.data.pipe(stream).on('close',(error)=>{
              
              if(error) {
                event.reply('print-file-fail-to-print', filePath);
                return console.error(error);
              }
              event.reply('print-file-ready-to-print', filePath);
              this.pdfBoxPrint({ printerName, filePath, event,data:filePath, copies: data.copies });
            })
          }).catch(console.error);
          
      });
    });
  } 

  pdfBoxPrint({ printerName, filePath, event, data, copies }: { printerName: String; filePath: String; event:any; data:String; copies:number }){
    const pdfboxPath = path.resolve(app.getAppPath(), 'static/PrintDirect.jar');
    let args: String[]  = [
      '--print',
      '-printsilent',
      filePath,
      printerName,
    ];
    if(copies > 1){
      args.push(String(copies));
    }
    let spawn = nodejre.spawn([pdfboxPath],'app.App', args);
    spawn.stdout.on('data',(sout) => {
      event.reply('print-file-done',data );
      console.log(`stdout: ${sout}`)
    });
    spawn.stderr.on('data',(sout) => console.log(`stderr: ${sout}`));
  }
}
