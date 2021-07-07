import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable, { Styles } from 'jspdf-autotable';

export interface IConfig {
  orientation: string;
  rows: string[][];
  theme: 'striped' | 'grid' | 'plain' | null;
  styles?: { fontSize: number };
  headerStyles?: Styles;
  columns: string[][];
  headerTitle: {
    text: string;
    fontSize: number;
    font: string;
    color: number[];
  };
  headerSubtitle?: {
    text: string;
    fontSize: number;
    font: string;
    color: number[];
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  headerDescSubtitle?: {
    text: string;
    fontSize: number;
    font: string;
    color: number[];
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  fileName: string;
  image?: {
    name: string;
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  [key: string]: any;
}
export class JsPdfHelper {
  print = (config: IConfig): any => {
    const numberOfReports = 1;
    const totalPagesExp = '{total_pages_count_string}';
    const doc = new jsPDF({ orientation: 'l' });
    for (let i = 0; i < numberOfReports; i++) {
      const pos = {
        ht: { v: 17, h: 14 },
        hs: { v: 45, h: 14 },
      };
      const pageContent = () => {
        if (config.headerTitle) {
          doc.setFontSize(config.headerTitle.fontSize);
          doc.setTextColor(
            config.headerTitle.color[0],
            config.headerTitle.color[1],
            config.headerTitle.color[2]
          );
          doc.text(config.headerTitle.text, pos.ht.h, pos.ht.v);
        }
        // headerSubtitle
        if (config.headerSubtitle) {
          doc.setFontSize(config.headerSubtitle.fontSize);
          // tslint:disable-next-line:max-line-length
          doc.setTextColor(
            config.headerSubtitle.color[0],
            config.headerSubtitle.color[1],
            config.headerSubtitle.color[2]
          );
          doc.text(config.headerSubtitle.text, pos.hs.h, pos.hs.v);
        }
        // headerDescSubtitle
        if (config.headerDescSubtitle) {
          doc.setFontSize(config.headerDescSubtitle.fontSize);
          // tslint:disable-next-line:max-line-length
          doc.setTextColor(
            config.headerDescSubtitle.color[0],
            config.headerDescSubtitle.color[1],
            config.headerDescSubtitle.color[2]
          );
          // tslint:disable-next-line:max-line-length
          doc.text(
            config.headerDescSubtitle.text,
            config.headerDescSubtitle.left,
            config.headerDescSubtitle.top
          );
        }
        if (config.image) {
          if (config.image) {
            doc.addImage(
              config.image.name,
              'PNG',
              config.image.left,
              config.image.top,
              config.image.width,
              config.image.height
            );
          }
        }
      };
      pageContent();
      autoTable(doc, {
        head: config.columns,
        body: config.rows,
        theme: config.theme,
        styles: config.styles,
        headStyles: config.headerStyles,
        margin: {
          top: 50,
        },
      });
      if (i !== numberOfReports - 1) {
        doc.addPage();
      } else {
        if (typeof doc.putTotalPages === 'function') {
          doc.putTotalPages(totalPagesExp);
        }
      }
    }
    doc.save(config.fileName + '.pdf');
    return;
  }
}
