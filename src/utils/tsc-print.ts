import edge from "electron-edge-js";

export class tscPrint {
    public static openport: any = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'openport'
    });
    public static about: any = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'about'
    });
    public static sendcommand: any = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'sendcommand'
    });
    public static clearbuffer: any = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'clearbuffer'
    });
    public static printerfont: any = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'printerfont'
    });
    public static barcode: any = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'barcode'
    });
    public static printlabel: any = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'printlabel'
    });
    public static closeport: any = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'closeport'
    });
    public static printer_status: any = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'printerstatus_string'
    })
};