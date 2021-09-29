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
  maxPage: number = 10;
  pagerStartIndex:number = 1;
  pagerPageCount: number = 10;


  showLoaderRepo = true;
  showLoaderDetails = true;

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
    this.githubService.getUserDetails(this.username).subscribe
    ( response => {
      this.userDetails = JSON.parse(JSON.stringify(response));
      this.showLoaderDetails = false;
    })
    this.getRepoList();
  }

  getRepoList(){
    this.showLoaderRepo = true;
    this.githubService.getRepos(this.username, this.itemsPerPage, this.currentPage).subscribe
    ( response => {
      this.repoList = JSON.parse(JSON.stringify(response));
      console.log(this.repoList);
      
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

  nextPages(){
    this.pagerStartIndex = this.pagerStartIndex + this.pagerPageCount;
    this.currentPage = this.pagerStartIndex;
    this.getRepoList();
  }
  earlierPages(){
    if(this.currentPage > this.pagerPageCount){
      this.pagerStartIndex = this.pagerStartIndex - this.pagerPageCount;
      this.currentPage = this.pagerStartIndex;
      this.getRepoList();
    }
  }
  selectPage(i: number){
    this.currentPage = i;
    this.getRepoList();
  }

}
