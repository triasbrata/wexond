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
import { createWriteStream, existsSync } from 'fs';
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


  
  private  jarPath: string; 
  protected javaPath: string;

  constructor(appWindow: AppWindow, settings: ISettings){
    let platform = os.platform().toString();
    let path_jar_prod = path.resolve(process.resourcesPath,'..','static','PrintDirect.jar');
    let path_jar_dev = path.resolve(app.getAppPath(), 'static/PrintDirect.jar');
    let path_win32 = path.join('C:', "Program Files", "Java", 'jre1.8.0_221', 'bin', 'java.exe');
    this.appWindow = appWindow;
    this.javaPath = platform == 'win32' ? `"${path_win32}"` : 'java';
    this.jarPath = existsSync(path_jar_prod) ? path_jar_prod : path_jar_dev; 
  }
  listenSettingFetchPrinter() {
    ipcMain.on('get-list-printer', (e: any) => {
      let cmd = spawnSync(this.javaPath, ['-jar', this.jarPath, '--getPrinter'], { shell: true });
      let parsed = JSON.parse(cmd.stdout.toString());
      e.sender.send('list-printer-fetched', parsed);
    });
    
  }

  listenFileToPrint(){
      ipcMain.on('print-file-direct', (event, arg) => {
        const selectedPrinter = settings.selectedPrinter;
        
        arg.map((data:IPrintData) => {
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
            response.data.pipe(stream).on('close',(error:any)=>{
              
              if(error) {
                event.reply('print-file-fail-to-print', filePath);
                return console.error(error);
              }
              event.reply('print-file-ready-to-print', filePath);
              this.printFile( printerName, filePath, event, filePath, parseInt(data.copies));
            })
          }).catch(console.error);
          
      });
    });
  } 

  printFile(printerName: string, filePath: string, event:any, data:string, copies:number ){
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
