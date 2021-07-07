import { ISelectCompanySize, ISelectCompanyType } from './company-sign-in.model';


export const COMPANYTYPES: ISelectCompanyType[] = [
    { label: 'Limitada', value: 'LTDA' },
    { label: 'Sociedade Anônima', value: 'SA' },
];

export const COMPANYSIZES: ISelectCompanySize[] = [
    { label: 'Microempresa', value: 'ME' },
    { label: 'Empresa de Pequeno Porte', value: 'EPP' },
    { label: 'Empresa de Médio Porte', value: 'EMP' },
    { label: 'Empresa de Grande Porte', value: 'GE' },
];

export const COMPANYTYPES_ALL: ISelectCompanyType[] = [
    { label: 'Microempreendedor Indivual', value: 'MEI' },
    { label: 'Empresa individual', value: 'EI' },
    { label: 'Empresa Individual de Responsabilidade Limitada', value: 'EIRELI' },
    { label: 'Limitada', value: 'LTDA' },
    { label: 'Sociedade Anônima', value: 'SA' },
];
