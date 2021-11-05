import { registerLocaleData } from "@angular/common";
import norwayLocale from '@angular/common/locales/nb';
import { ApiUrl } from "@core/api-url.enum";
import { Employer, InboundEmailPassword, Mission } from "@core/models";
import { StateEmployers, StateMissions } from "@core/state/global-state.interfaces";
import { ModelState } from "@core/state/model-state.interface";
import { environment } from "src/environments/environment.e2e";

registerLocaleData(norwayLocale, 'nb-NO');

describe('Data Management', () => {
    
    const defaultEmployer : Employer = { id: '1', name: "bsu", phoneNumber: "3434", address: "edsada", email: "342@bsu.no" }   
    const defaultMission : Mission = { 
        id: '1', address: 'test', phoneNumber: "3213", 
        employerId: defaultEmployer.id
    };
    const defaultEmailPw : InboundEmailPassword = { id: '1', password: "testpw" }   

    const defaultState : Partial<ModelState>  = { 
        missions: [defaultMission], employers: [defaultEmployer], inboundEmailPasswords: [defaultEmailPw]
    }

    const login = (state: Partial<ModelState>) => cy.login('Leder', '/data', state); 

    const getCol = <T>(prop: keyof T | string, row: number = 0) => getRow(row).find(`[col-id^="${prop}"]`);
    const getRow = (i: number) => cy.get(`[row-index="${i}"]`);

    const assertSameValueCol = <T>(model: T, prop: keyof T) => 
        getCol(<any>prop).should('contain', model[prop]);

    const selectData = (prop: keyof ModelState) => {
        cy.getCy("data-property-picker").click();
        cy.getCy('select-'+prop).click();
    }

    const deleteSelections = () => 
        cy.getCy('bottom-bar-action').filter(':contains("Slett")').click().dialogConfirm();
    
    beforeEach(() => {
        for(const url of [ApiUrl.Mission, ApiUrl.Employer, ApiUrl.InboundEmailPassword]) {
            cy.intercept('PUT', '**' + url + '/**', { statusCode: 200, delay: 200 }).as('update'+url);
            cy.intercept('GET', '**' + url + '**', { statusCode: 200 }, ).as('get'+url); 
            cy.intercept('POST', '**' + url + '/DeleteRange', { statusCode: 204, delay: 100 }).as('deleteMissionDoc').as('delete'+url);  
        }   
    })

    it('Should display mission row correctly and update values', () => {
        login(defaultState);
        selectData("missions");

        const newValues : Partial<Mission> = { address: "newaddress", phoneNumber: "newphone" }
        getRow(0).should('exist');
        //Assert existing values are correct
        assertSameValueCol<Mission>(defaultMission, "id");
        assertSameValueCol<Mission>(defaultMission, "address");
        getCol<Mission>("finished").should('contain', defaultMission.finished ? 'Ja' : 'Nei');
        assertSameValueCol<Mission>(defaultMission, "phoneNumber");
        getCol<Mission>("employerId").should('contain', defaultEmployer.name);

        //Assert that each property can update except ID (no validation), dropping select for now
        getCol<Mission>("address").type(newValues.address + "{enter}");
        getCol<Mission>("phoneNumber").type(newValues.phoneNumber + "{enter}");
           
        cy.storeState<StateMissions>().then(state => {
            const mission = state.missions?.find(x => x.id === defaultMission.id);
            expect(mission?.address).to.eq(newValues.address);
            expect(mission?.phoneNumber).to.eq(newValues.phoneNumber);
        })
    })

    it('Should display employer row correctly and update values', () => {
        login(defaultState);
        selectData("employers");

        getRow(0).should('exist');

        //Assert existing values are correct
        for(const key in defaultEmployer)
            assertSameValueCol<Employer>(defaultEmployer, <any> key);

        const newValues : Partial<Employer> = { 
            address: "newaddress", phoneNumber: "newphone", name: "dsa", email: "newema@ema.com" 
        }
    
        //Assert that each property can update except ID (no validation)
        for(const key in newValues)
            getCol<Employer>(key).type((<any> newValues)[key] + "{enter}");
             
        cy.storeState<StateEmployers>().then(state => {
            const employer = state.employers?.find(x => x.id === defaultEmployer.id);
            for(const key in newValues){
                expect((<any> employer)[key]).to.eq((<any> newValues)[key]);
            }
        })
    })

    it('Should display email password row correctly', () => {
        login(defaultState);
        selectData("inboundEmailPasswords");

        getRow(0).should('exist');

        //Assert existing values are correct
        for(const key in defaultEmailPw)
            assertSameValueCol<InboundEmailPassword>(defaultEmailPw, <any> key);

        getCol("email").should('contain', defaultEmailPw.password + '@' + environment.inboundEmailDomain)
    })

    it('Should delete range for all models', () => {
        const state : Partial<ModelState> = { missions: [], employers: [], inboundEmailPasswords: [] };

        for(let i = 0; i < 10; i++){
            state.missions?.push({...defaultMission, id: i.toString()});
            state.employers?.push({...defaultEmployer, id: i.toString()});
            state.inboundEmailPasswords?.push({...defaultEmailPw, id: i.toString()});
        }

        login(state);

        for(let stateProp in state){
            cy.log("DeleteRange - " + stateProp)
            selectData(<any> stateProp);
            for(let  i = 0; i < 7; i++) getCol("checkbox", i).click();          
            deleteSelections();
            cy.wait(200);
            cy.storeState().then(state => {
                expect((<any> state)[stateProp].length).to.eq(3)
            })
        }
    })
});