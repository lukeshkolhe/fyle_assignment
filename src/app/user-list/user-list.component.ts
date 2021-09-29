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
  maxPage: number = 10;
  pagerStartIndex:number = 1;
  pagerPageCount: number = 10;
  userList!: UserListModel;
  showLoader = false;
  constructor(private githubService: GithubService, private router: Router) { }

  ngOnInit(): void {
    console.log(window.innerWidth);
    
    if(window.innerWidth < 600){
      this.pagerPageCount = 5;
    }
  }

  openUser(userName : string){
    this.router.navigate(['user'], {queryParams: {'user-name': userName}});
  }

  getUserList(){
    this.showLoader = true;
    this.githubService.getUserList(this.searchKeyword, this.itemsPerPage, this.currentPage).subscribe(
      (response) => {
        this.showLoader = false;
        this.userList = JSON.parse(JSON.stringify(response));
        this.maxPage = this.userList.total_count / this.itemsPerPage;
      }
    )
  }



  nextPages(){
    this.pagerStartIndex = this.pagerStartIndex + this.pagerPageCount;
    this.currentPage = this.pagerStartIndex;
    this.getUserList();
  }
  earlierPages(){
    if(this.currentPage > this.pagerPageCount){
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
