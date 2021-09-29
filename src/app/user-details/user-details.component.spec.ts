import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GithubService } from '../services/github.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserDetailsComponent } from './user-details.component';
import { ReposList } from '../Models/reposList';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let githubService: GithubService;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[UserDetailsComponent , 
      {provide: GithubService, useClass : GithubService}],
      declarations: [ UserDetailsComponent ],
      imports: [ 
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ]
    });
    component = TestBed.inject(UserDetailsComponent);
    githubService = TestBed.inject(GithubService)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
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

  it('should add a topic to repoList named javascript', ()=>{
    component.repoList = [new ReposList()];
    component.setTopic("0", ['javascript']);
    expect(component.repoList[0].topics[0]).toBe("javascript");
  })
});
