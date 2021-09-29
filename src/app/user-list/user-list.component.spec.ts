import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserListComponent } from './user-list.component';
import { RouterModule } from '@angular/router';
import { UserListModel } from '../Models/UserListModel';
import { By } from '@angular/platform-browser';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListComponent ],
      imports: [
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should change current page to 5', ()=>{
    component.selectPage(5);
    expect(component.currentPage).toBe(5);
  })

  it('should change current page to 11', ()=>{
    component.nextPages();
    expect(component.currentPage).toBe(11);
  })

  it('should not change any thing', ()=>{
    component.earlierPages();
    expect(component.currentPage).toBe(1);
  })


  it('should change current page to 51', ()=>{
    component.nextPages();
    component.nextPages();
    component.nextPages();
    component.nextPages();
    component.nextPages();
    expect(component.currentPage).toBe(51);
  })
});
