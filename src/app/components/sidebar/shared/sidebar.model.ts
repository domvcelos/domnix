export interface IMenu {
  icon: string;
  label: string;
  path: string;
  id: string;
  subMenu: IMenu[];
}
