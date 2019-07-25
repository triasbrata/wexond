import * as React from 'react';

import store from '~/renderer/views/app/store';
import { Dropdown } from '~/renderer/components/Dropdown';
import Switch from '~/renderer/components/Switch';
import { Content } from '../../../style';
import { Title, Row, Control, Header, SubHeader } from '../style';
import { onSwitchChange } from '~/renderer/views/app/utils';
import console = require('console');
import { PrinterInfo } from 'electron';
import { PrinterUsedFor, ISelectedPrinter } from '~/interfaces/selected-printer';

const onSelectPrinterChange = (name: string, usedFor: string) => {
  store.settings.object.selectedPrinter = store.settings.object.selectedPrinter.filter(function (item:ISelectedPrinter) {
    return item.usedFor != usedFor;
  });
  store.settings.object.selectedPrinter.push({ name,usedFor });
  let { selectedPrinter } = store.settings.object;
  store.settings.save();
};
const SelectPrinter = (props:{usedFor:string, title:string}) =>{
  const {usedFor, title} = props
  const { listPrinter } = store.settings;
  const { selectedPrinter } = store.settings.object;
  const defaultPrinter = (usedFor: string) => {
    let selectedFromStore = selectedPrinter.find((item: ISelectedPrinter) => {
      return item.usedFor === usedFor;
    });
    if (!selectedFromStore) {
      return '';
    }
    return selectedFromStore.name
  };
  return  (
    <Row>
      <Title>{title}</Title>
      <Control>
        <Dropdown
          defaultValue={defaultPrinter(usedFor)}
          onChange={name => onSelectPrinterChange(name, usedFor)}>
          {listPrinter.map(({name} = printer, key) => {
            return (<Dropdown.Item key={key} value={name}>{name}</Dropdown.Item>);
          })}
        </Dropdown>
      </Control>
    </Row>);
};

export const Printer = () => {
  return (
    <Content>
      <Header>Printer Default</Header>
      <SelectPrinter title="Print Laporan" usedFor={PrinterUsedFor.REPORT} />
      <SelectPrinter title="Printer Gelang Laki-Laki" usedFor={PrinterUsedFor.GELANG_LAKI} />
      <SelectPrinter title="Printer Gelang Wanita" usedFor={PrinterUsedFor.GELANG_WANITA} />
      <SelectPrinter title="Printer Label Depo Biru" usedFor={PrinterUsedFor.LABEL_BIRU_DEPO} />
      <SelectPrinter title="Printer Label Depo Putih" usedFor={PrinterUsedFor.LABEL_PUTIH_DEPO} />
    </Content>
  );
};
