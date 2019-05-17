import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  ano: any;
  constructor() { }

  ngOnInit() {
    var dt = new Date();
    this.ano = dt.getFullYear();
  }

}
