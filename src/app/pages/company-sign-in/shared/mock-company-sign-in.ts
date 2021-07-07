import { ISelectCompanySize, ISelectCompanyType } from './company-sign-in.model';


export const COMPANYTYPES: ISelectCompanyType[] = [
    { label: 'Microempreendedor Indivual', value: 'MEI' },
    { label: 'Empresa individual', value: 'EI' },
    { label: 'Empresa Individual de Responsabilidade Limitada', value: 'EIRELI' },
];

export const COMPANYSIZES: ISelectCompanySize[] = [
    { label: 'Microempreendedor Indivual', value: 'MEI' },
    { label: 'Microempresa', value: 'ME' },
    { label: 'Empresa de Pequeno Porte', value: 'EPP' },
];
