export class PrinterUsedFor {
    static readonly GELANG_LAKI = 'GELANG_LAKI_LAKI';
    static readonly GELANG_WANITA = 'GELANG_WANITA';
    static readonly LABEL_BIRU_DEPO = 'LABEL_BIRU';
    static readonly LABEL_PUTIH_DEPO = 'LABEL_PUTIH';
    static readonly REPORT = 'REPORT';
}

export interface ISelectedPrinter{
    name:string,
    usedFor:string
}