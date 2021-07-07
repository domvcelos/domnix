import { TestBed } from '@angular/core/testing';
import { MENULIST } from './mock-sidebar';

import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#getMenuList should return value from observable', (done: DoneFn) => {
    service.getMenuList().then((value) => {
      expect(value).toBe(MENULIST);
      done();
    });
  });
});
