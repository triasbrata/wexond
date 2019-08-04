import edge from "electron-edge-js";

try {
    let openport = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'openport'
    });
}
catch (error) {
    console.log(error);
}


try {
    let about = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'about'
    });
}
catch (error) {
    console.log(error);
}

try {
    let sendcommand = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'sendcommand'
    });
}
catch (error) {
    console.log(error);
}


try {
    let clearbuffer = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'clearbuffer'
    });
}
catch (error) {
    console.log(error);
}


try {
    let printerfont = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'printerfont'
    });
}
catch (error) {
    console.log(error);
}


try {
    let barcode = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'barcode'
    });
}
catch (error) {
    console.log(error);
}



try {
    let printlabel = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'printlabel'
    });
}
catch (error) {
    console.log(error);
}


try {
    let closeport = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'closeport'
    });
}
catch (error) {
    console.log(error);
}


try {
    let printer_status = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'printerstatus_string'
    });
}
catch (error) {
    console.log(error);
}