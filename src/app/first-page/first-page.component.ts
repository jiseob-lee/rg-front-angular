import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EnvironmentService } from '../environment.service';

@Component({
    selector: 'app-first-page',
    templateUrl: './first-page.component.html',
    styleUrls: ['./first-page.component.css'],
	imports: [CommonModule],
    standalone: true
})
export class FirstPageComponent implements OnInit {


  constructor(
	public environmentService: EnvironmentService,
  ) {
    //this.routeEvent(this.router);
  }


  ngOnInit() {

    this.environmentService.getEmptyRequest().subscribe(
      response => {
        //console.log("빈 요청 2-1", response);
	//console.log("빈 요청 2-2", response.RequestURI);
      }
    );

  }

}
