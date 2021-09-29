import { Component, OnInit, ViewChild } from '@angular/core';
import { GithubService } from '../services/github.service';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild(UserListComponent)
  userListComponent!: UserListComponent;
  searchKeyword = "";
  constructor() { }

  ngOnInit(): void {
  }

  getUsers(){
    if(this.searchKeyword === ''){
      alert("Please enter valid username");
      return;
    }
    this.userListComponent.getUserList();
  }
}
