import { ipcRenderer, remote, webFrame } from 'electron';
import console = require('console');

const tabId = remote.getCurrentWebContents().id;

const goBack = () => {
  ipcRenderer.send('browserview-call', { tabId, scope: 'webContents.goBack' });
};

const goForward = () => {
  ipcRenderer.send('browserview-call', {
    tabId,
    scope: 'webContents.goForward',
  });
};

window.addEventListener('mouseup', e => {
  if (e.button === 3) {
    goBack();
  } else if (e.button === 4) {
    goForward();
  }
});

webFrame.executeJavaScript('window', false, (w: any) => { });

let beginningScrollLeft: number = null;
let beginningScrollRight: number = null;
let horizontalMouseMove = 0;
let verticalMouseMove = 0;

const resetCounters = () => {
  beginningScrollLeft = null;
  beginningScrollRight = null;
  horizontalMouseMove = 0;
  verticalMouseMove = 0;
};

function getScrollStartPoint(x: number, y: number) {
  let left = 0;
  let right = 0;

  let n = document.elementFromPoint(x, y);

  while (n) {
    if (n.scrollLeft !== undefined) {
      left = Math.max(left, n.scrollLeft);
      right = Math.max(right, n.scrollWidth - n.clientWidth - n.scrollLeft);
    }
    n = n.parentElement;
  }
  return { left, right };
}

document.addEventListener('wheel', e => {
  verticalMouseMove += e.deltaY;
  horizontalMouseMove += e.deltaX;

  if (beginningScrollLeft === null || beginningScrollRight === null) {
    const result = getScrollStartPoint(e.deltaX, e.deltaY);
    beginningScrollLeft = result.left;
    beginningScrollRight = result.right;
  }
});

ipcRenderer.on('scroll-touch-end', () => {
  if (
    horizontalMouseMove - beginningScrollRight > 150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollRight < 10) {
      goForward();
    }
  }

  if (
    horizontalMouseMove + beginningScrollLeft < -150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollLeft < 10) {
      goBack();
    }
  }

  resetCounters();
});
const isVisible = (element: HTMLElement) => {
  return element.offsetHeight !== 0;
}

const inputFilters = {
  type: /text|email|password/i,
  name: /login|username|email|password/i,
}

const getFormInputs = (form: HTMLFormElement) => {
  const id = form.getAttribute('id');
  const inside: HTMLInputElement[] = Array.from(form.querySelectorAll('input'));
  const outside: HTMLInputElement[] = id != null ? Array.from(document.querySelectorAll(`input[form=${id}]`)) : [];
  return [...inside, ...outside];
}

const testInput = (input: HTMLInputElement) => {
  const type = input.getAttribute('type');
  const name = input.getAttribute('name');
  return isVisible(input) && inputFilters.type.test(type) && inputFilters.name.test(name);
}

window.addEventListener('load', () => {
  const forms = document.querySelectorAll('form');
  let input = document.createElement('input');
  let isElectron = input.cloneNode();
  
  isElectron.setAttribute('type', 'hidden');
  isElectron.setAttribute('name', 'isElectron');
  isElectron.setAttribute('value', '1');
  forms.forEach(form => {
    let form_class = form.getAttribute('class');
    if(form_class == null){
      return;
    }
    if (form_class.includes('need-electron-validation')){
      alert('booom');
      form.appendChild(isElectron);
    }
    if (form.getAttribute('id') == 'form_etiket'){
      let wantRaw = input.cloneNode(); 
      wantRaw.setAttribute('type', 'hidden');
      wantRaw.setAttribute('name', 'want');
      wantRaw.setAttribute('value', 'raw');   
      form.appendChild(wantRaw);
    }
  })
});


window.addEventListener('print-file',(e:any) => {
  ipcRenderer.send('print-file-direct', e.detail);  
});
ipcRenderer.on('printer-not-setted',(e, file_name)=>{
  window.dispatchEvent(new CustomEvent('print-file-progress',{detail:{
    file_name,
    progress:'no printer'
  }}));
});
ipcRenderer.on('print-file-downloaded',(e, file_name)=>{
  window.dispatchEvent(new CustomEvent('print-file-progress',{detail:{
    file_name,
    progress:'prepare to download'
  }}));
});
ipcRenderer.on('print-file-fail-to-print',(e, file_name)=>{
  window.dispatchEvent(new CustomEvent('print-file-progress',{detail:{
    file_name,
    progress:'fail to print'
  }}));
});
ipcRenderer.on('print-file-ready-to-print',(e, file_name)=>{
  window.dispatchEvent(new CustomEvent('print-file-progress',{detail:{
    file_name,
    progress:'ready-to-print'
  }}));
});
ipcRenderer.on('print-file-done',(e, file_name)=>{
  window.dispatchEvent(new CustomEvent('print-file-progress',{detail:{
    file_name,
    progress:'print-done'
  }}));
});