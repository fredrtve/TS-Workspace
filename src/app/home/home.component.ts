import { Component } from '@angular/core';
import { Mission } from '../shared/models';
import { Roles } from '../shared/enums';
import { MissionService, MainNavService } from '../core/services';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public Roles = Roles;

  newestMissions: Mission[] = []

  missionHistory$: Observable<Mission[]>;

  constructor(
    private router: Router,
    private mainNavService: MainNavService,
    private missionService: MissionService) {
    this.configureMainNav();
  }

  ngOnInit() {
    this.missionHistory$ = this.missionService.getAll$().pipe(map(x => {
      let sorted = this.missionService.sortByHistory(x);
      return sorted.slice(0,4);
    }))
  }

  goToAdminTimesheets = () => this.router.navigate(['timeadministrering']);

  goToAdminData = () => this.router.navigate(['data']);

  goToAdminUsers = () => this.router.navigate(['brukere']);

  goToTimesheetStats = () => this.router.navigate(['timestatistikk']);
  
  private configureMainNav(){
    let cfg = this.mainNavService.getDefaultConfig();
    cfg.title = "Hjem";
    this.mainNavService.addConfig(cfg);
  }
  

}
