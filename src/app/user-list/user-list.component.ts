import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserListModel } from '../Models/UserListModel';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @Input()
  searchKeyword!: string;
  itemsPerPage : number = 10;
  currentPage: number = 1;
  maxPages: number = 1;
  pagerStartIndex:number = 1;
  pagerPageCount: number = 10;
  defaultPageCount: number = 10;
  userList!: UserListModel;
  showLoader = false;
  constructor(private githubService: GithubService, private router: Router) { }

  ngOnInit(): void {
    if(window.innerWidth < 600){
      this.pagerPageCount = 5;
      this.defaultPageCount = 5;
    }
  }

  openUser(userName : string){
    this.router.navigate(['user'], {queryParams: {'user-name': userName}});
  }

  getUserList(){
    this.itemsPerPage = Number.parseInt(this.itemsPerPage.toString());
    if(this.searchKeyword == ''){
      alert("please enter a valdi search keyword");
      return;
    }
    this.showLoader = true;
    this.githubService.getUserList(this.searchKeyword, this.itemsPerPage, this.currentPage).subscribe(
      (response) => {        
        this.showLoader = false;
        this.userList = JSON.parse(JSON.stringify(response));
        if(this.userList.total_count % this.itemsPerPage == 0){
          this.maxPages = Math.floor(this.userList.total_count / this.itemsPerPage);
        } else {
          this.maxPages = Math.floor((this.userList.total_count / this.itemsPerPage) + 1);
        }
        if(this.maxPages < this.defaultPageCount){
          this.pagerPageCount = this.maxPages;
        }
        if(this.pagerStartIndex > this.maxPages){
          this.pagerStartIndex = 1;
          this.currentPage = 1;
        }
        if(this.currentPage > this.maxPages){
          this.currentPage = this.maxPages;
        }
      }
    )
  }



  nextPages(){
    if(this.pagerStartIndex + this.pagerPageCount  < this.maxPages){
      this.pagerStartIndex = this.pagerStartIndex + this.pagerPageCount;
      if(this.maxPages < this.pagerStartIndex + this.pagerPageCount){
        this.pagerPageCount = this.maxPages - this.pagerStartIndex + 1;
      }
      this.currentPage = this.pagerStartIndex;
      this.getUserList();
    }
  }
  earlierPages(){
    if(this.pagerStartIndex > this.pagerPageCount){
      this.pagerPageCount = this.defaultPageCount;
      this.pagerStartIndex = this.pagerStartIndex - this.pagerPageCount;
      this.currentPage = this.pagerStartIndex;
      this.getUserList();
    }
  }
  selectPage(i: number){
    this.currentPage = i;
    this.getUserList();
  }

}
