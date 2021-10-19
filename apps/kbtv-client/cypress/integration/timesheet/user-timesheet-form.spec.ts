import { DatePipe } from "@angular/common";
import { ApiUrl } from "@core/api-url.enum";
import { Mission, UserTimesheet } from "@core/models";
import { StateUserTimesheets } from "@core/state/global-state.interfaces";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { _stringGen } from "cypress/support";
import { _getFirstDayOfWeek } from "date-time-helpers";
import { registerLocaleData } from '@angular/common';
import norwayLocale from '@angular/common/locales/nb';

registerLocaleData(norwayLocale, 'nb-NO');

describe("User Timesheet Form", () => {

    const datePipe = new DatePipe("nb-NO");

    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    const oneHour = 3.6e6;
    const mission: Mission = {id: '1', address: 'testaddress', lastVisited: new Date().getTime(), createdAt: new Date().getTime() }
    const mission2: Mission = {id: '2', address: 'uniqueaddr2', lastVisited: new Date().getTime(), createdAt: new Date().getTime() }
    const timesheet: UserTimesheet = { id: '1', missionId: mission.id, 
        status: TimesheetStatus.Open, comment: "test", totalHours: 8, 
        startTime: _getFirstDayOfWeek().getTime(), endTime: _getFirstDayOfWeek().getTime() + 8*oneHour
    }

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.Timesheet, { statusCode: 204, delay: 100 }).as('createTimesheet');
        cy.intercept('PUT', '**' + ApiUrl.Timesheet + '/**', { statusCode: 204, delay: 100 }).as('updateTimesheet');  
        cy.intercept('DELETE', '**' + ApiUrl.Timesheet + '/**', { statusCode: 204, delay: 100 }).as('deleteTimesheet');  
    })


    it('can fill in form and create timesheet', () => {  
        cy.login('Leder', '/mine-timer/liste', { missions: [mission,mission2] }); 
        cy.mainFabClick();
        cy.wait(200);

        isNotSubmittable();
        
        cy.getCy('form-missionInput','input').type(mission.address!); 
        cy.submitForm().getCy('form-missionInput','mat-error').should('exist'); //Check for error until item clicked
        cy.getCy('form-missionInput','input').click().wait(1000);
        cy.get('mat-option').first().click();

        isNotSubmittable();

        //Check that it is not submittable with invalid comment
        const comment = 'thisisatestcomment';
        cy.assertTextFormControl("comment", comment, [
            _stringGen(ValidationRules.TimesheetCommentMaxLength + 1)
        ], "textarea")
        isNotSubmittable(); 

        const dateParams = { year: 1996, month: 4, day: 12 }
        cy.getCy('form-date').wait(1000).click().wait(1000);//Ensure ion picker shows up
        cy.get('ion-picker').should('exist'); 
        cy.wait(2000); //Have to wait for selection to work on first
        cy.ionDateSelect(dateParams);
        cy.contains("Ferdig").click();

        isNotSubmittable(); 

        const startParams = { hour: 12, minutes: 30 }
        cy.getCy('form-startTime').click();
        cy.get('ion-picker').should('exist'); //Ensure ion picker shows up 
        cy.wait(200); 
        cy.ionTimeSelect(startParams);
        cy.contains("Ferdig").click();

        isNotSubmittable(); 

        const endParams = { hour: 15, minutes: 30 }
        cy.getCy('form-endTime').click();
        cy.get('ion-picker').should('exist'); //Ensure ion picker shows up
        cy.wait(200);
        cy.ionTimeSelect(endParams);
        cy.contains("Ferdig").click();

        isSubmittable();

        //Submit and check that new mission exists in state
        cy.getCy('submit-form').click();
        cy.wait('@createTimesheet');
        cy.storeState<StateUserTimesheets>().then(state => {
            expect(state.userTimesheets).to.have.lengthOf(1);
            const timesheet = state.userTimesheets![0];
            expect(timesheet.missionId).to.equal(mission.id);
            expect(timesheet.comment).to.equal(comment);
            expect(timesheet.totalHours).to.equal(endParams.hour - startParams.hour);
            expect(timesheet.startTime).to.be.closeTo(
                new Date(dateParams.year, dateParams.month, dateParams.day, startParams.hour, startParams.minutes).getTime(), 6e4
            );
            expect(timesheet.endTime).to.be.closeTo(
                new Date(dateParams.year, dateParams.month, dateParams.day, endParams.hour, endParams.minutes).getTime(), 6e4
            );
        })
    });

    it('shows current values on update & updates changed values', () => {
        cy.login('Leder', '/mine-timer', { missions: [mission,mission2], userTimesheets: [timesheet] });  
        cy.get('app-timesheet-mission-bar').click();
        cy.wait(200);   
        
        //Check that existing values are filled in
        cy.getCy('form-missionInput','input').invoke('val').should('equal', mission.address);      
        cy.getCy('form-date','input').invoke('val').should('equal', datePipe.transform(timesheet.startTime, "MMM d, y"));   
        cy.getCy('form-startTime','input').invoke('val').should('equal', datePipe.transform(timesheet.startTime, "HH:mm"));   
        cy.getCy('form-endTime','input').invoke('val').should('equal', datePipe.transform(timesheet.endTime, "HH:mm"));  
        cy.getCy('form-comment','textarea').invoke('val').should('equal', timesheet.comment);

        const updated = { mission: mission2, 
            date: { year: 2019, month: 4, day: 12 }, 
            start: { hour: 6, minutes: 15 }, 
            end: { hour: 9, minutes: 15 } 
        };

        //Update values
        cy.getCy('form-missionInput','input').clear().type(updated.mission.address!); 
        cy.wait(500).get('mat-option').first().click();

        cy.getCy('form-date').wait(1000).click().wait(1000);//Ensure ion picker shows up
        cy.wait(2000); //Have to wait for selection to work on first
        cy.ionDateSelect(updated.date);
        cy.contains("Ferdig").click();

        cy.getCy('form-startTime').click();//Ensure ion picker shows up
        cy.wait(200); //Have to wait for selection to work on first
        cy.ionTimeSelect(updated.start);
        cy.contains("Ferdig").click();

        cy.getCy('form-endTime').click();//Ensure ion picker shows up
        cy.wait(200); //Have to wait for selection to work on first
        cy.ionTimeSelect(updated.end);
        cy.contains("Ferdig").click();


        cy.getCy('submit-form').click();
        cy.wait('@updateTimesheet');

        const {year, month, day} = updated.date;
        cy.storeState<StateUserTimesheets>().then(state => {
            const timesheet = state.userTimesheets![0];
            expect(timesheet.missionId).to.equal(updated.mission.id);
            expect(timesheet.totalHours).to.equal(updated.end.hour - updated.start.hour);
            expect(timesheet.startTime).to.be.closeTo(
                new Date(year, month, day, updated.start.hour, updated.start.minutes).getTime(), 6e4
            );
            expect(timesheet.endTime).to.be.closeTo(
                new Date(year, month, day, updated.end.hour, updated.end.minutes).getTime(), 6e4
            );
            expect(timesheet.comment).to.equal(timesheet.comment);
        })
    })

    it('Can delete current timesheet', () => {
        cy.login('Leder', '/mine-timer', { missions: [mission,mission2], userTimesheets: [timesheet] });  
        cy.get('app-timesheet-mission-bar').click();
        cy.wait(200);   

        cy.getCy('form-sheet-action').filter(":contains('delete_forever')").click().dialogConfirm();
        cy.wait('@deleteTimesheet');

        cy.storeState<StateUserTimesheets>().then(state => {
            const timesheets = state.userTimesheets?.filter(x => x.id === timesheet.id);
            expect(timesheets).to.have.lengthOf(0);
        })
    })

    it('Autocomplete shows first 50 missions by default ', () => {
        const missions =[];
        for(let i = 0; i < 100; i++){
            missions.push({id: i.toString(), address: 'testaddress'  + i, 
                lastVisited: new Date().getTime() + (i*1000), 
                createdAt: new Date().getTime() + (i*1000)
            })
        }
        cy.login('Leder', '/mine-timer/liste', { missions }); 
        cy.mainFabClick();
        cy.wait(200);

        cy.getCy('form-missionInput','input').click();
        cy.wait(200);
        for(let i = 0; i < 50; i++){
            cy.get(`.mat-autocomplete-visible > #mat-option-${i + 1}`)
                .should('contain.text', missions[i].address)
        }
    })

})

