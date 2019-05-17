import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(() => {
     const trees: any = $('[data-widget="tree"]');
      if (trees) {        
        trees.tree();
      }
      
    });
  }

}
