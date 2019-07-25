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
import { spawn, spawnSync } from 'child_process';


export interface IPrintData {
  file : string,
  copies: string,
  printer_use : string
}
export class PrintDirect{
  @observable
  protected appWindow: AppWindow;


  
  private readonly jarPath = path.resolve(app.getAppPath(), 'static/PrintDirect.jar');
  protected javaPath: string;

  constructor(appWindow: AppWindow, settings: ISettings){
    this.appWindow = appWindow;
    this.javaPath = os.platform().toString() == 'win32' ? path.join('C:', "Program Files", "Java", 'jre1.8.0_221', 'bin', 'java.exe') : 'java';

  }
  listenSettingFetchPrinter() {
    ipcMain.on('get-list-printer', (e: any) => {
      let parsed = JSON.parse(spawnSync(this.javaPath, ['-jar', this.jarPath, '--getPrinter'], { shell: true }).stdout.toString());
      console.log(parsed);
      e.sender.send('list-printer-fetched', parsed);
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

  pdfBoxPrint({ printerName, filePath, event, data, copies }: { printerName: string; filePath: string; event:any; data:string; copies:number }){
    const pdfboxPath = this.jarPath;
    let args: string[]  = [
      " -jar",
      pdfboxPath,
      '--print',
      '-printsilent',
      filePath,
      `"${printerName}"`,
    ];
    
    if(copies > 1){
      args.push(String(copies));
    }
    console.log(args);
    let cmd = spawn(this.javaPath, args,{
      shell:true,
    });
    cmd.stdout.on('data',(sout) => {
      event.reply('print-file-done',data );
      console.log(`stdout: ${sout}`)
    });
    cmd.stderr.on('data',(sout) => console.log(`stderr: ${sout}`));
  }
}
