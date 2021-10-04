import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReposList } from '../Models/reposList';
import { UserDetailsModel } from '../Models/UserDetailsModel';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  itemsPerPage : number = 10;
  currentPage: number = 1;
  pagerStartIndex:number = 1;
  pagerPageCount: number = 10;
  defaultPageCount: number = 10;
  maxPages: number = 1;


  showLoaderRepo = true;
  showLoaderDetails = true;

  allReposList : ReposList[] | undefined;
  repoList : ReposList[] | undefined;
  userDetails : UserDetailsModel | undefined;
  username : string = '';
  constructor(private activatedRoute: ActivatedRoute, private router : Router, private githubService : GithubService) { 
    activatedRoute.queryParams.subscribe(
      param => {        
        this.username = param['user-name'];
      }
    )
    if(this.username == '' || this.username == undefined){
      router.navigate([''])
    }
    
  }

  ngOnInit(): void {

    if(window.innerWidth < 600){
      this.pagerPageCount = 5;
      this.defaultPageCount = 5;
    }
    this.githubService.getUserDetails(this.username).subscribe
    ( response => {
      this.userDetails = JSON.parse(JSON.stringify(response));
      this.showLoaderDetails = false;
    })
    this.getRepoList();
  }

  getRepoList(){
    this.showLoaderRepo = true;
    this.githubService.getRepos(this.username).subscribe
    ( response => {
      this.allReposList = JSON.parse(JSON.stringify(response));
      if(this.allReposList){
        if(this.allReposList.length % this.itemsPerPage == 0){
          this.maxPages = Math.floor(this.allReposList.length / this.itemsPerPage);
        } else this.maxPages = Math.floor(this.allReposList.length / this.itemsPerPage) + 1;
        if(this.maxPages < this.defaultPageCount){
          this.pagerPageCount = this.maxPages;
        } else {
          this.pagerPageCount = this.defaultPageCount;
        }
      }
      this.setRepoList();
      for(let i in this.repoList){
        this.githubService.getTopics(this.repoList[Number(i)].languages_url).subscribe(
          topics => {
            let obj = JSON.stringify(topics).replace("{", "").replace("}", "").replace('"', "").split(',');
            var t;
            t = new Array(obj.length);
            for(let s in obj){
              t[s] = obj[s].split(':')[0].replace('"', "");
            }
            this.setTopic(i, t);
          }
        )
      }
      this.showLoaderRepo = false;
    })
  }
  setTopic(i: string, t : string[]){
    if(this.repoList != undefined){
      this.repoList[Number(i)].topics = t;
    }
  }

  setRepoList(){
    
    this.repoList = this.allReposList?.slice((this.currentPage - 1) * this.itemsPerPage, ((this.currentPage - 1) * this.itemsPerPage) + this.itemsPerPage);
  }

  nextPages(){
    if(this.pagerStartIndex + this.pagerPageCount < this.maxPages){
      this.pagerStartIndex = this.pagerStartIndex + this.pagerPageCount;
      if(this.maxPages < this.pagerStartIndex + this.pagerPageCount){
        this.pagerPageCount = this.maxPages - this.pagerStartIndex + 1;
      }
      this.currentPage = this.pagerStartIndex;
      // this.getRepoList();
      this.setRepoList();}
  }
  earlierPages(){
    if(this.pagerStartIndex > this.pagerPageCount){
      this.pagerPageCount = this.defaultPageCount;
      this.pagerStartIndex = this.pagerStartIndex - this.pagerPageCount;
      this.currentPage = this.pagerStartIndex;
      // this.getRepoList();
    this.setRepoList();
    }
  }
  selectPage(i: number){
    this.currentPage = i;
    this.setRepoList();
  }

}
