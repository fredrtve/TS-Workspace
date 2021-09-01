import { ApiUrl } from "@core/api-url.enum";
import { User } from "@core/models";
import { Roles } from "@core/roles.enum";

describe("Timesheet Admin User List", () => {

    const employer : User = 
        { userName: "Oppdragsgiver", firstName: "employerFirstName", lastName: "lastName2", role: Roles.Oppdragsgiver }
    

    const employees : User[] = [
        { userName: "Leder", firstName: "firstName3", lastName: "lastName3", role: Roles.Leder },
        { userName: "Mellomleder", firstName: "firstName4", lastName: "lastName4", role: Roles.Mellomleder },
        { userName: "Ansatt", firstName: "firstName5", lastName: "lastName5", role: Roles.Ansatt }
    ]

    const listItems = () => cy.getCy("user-list-item");

    beforeEach(() => {
        cy.intercept('GET', '**' + ApiUrl.Users + '**', { statusCode: 204, delay: 100 });
        cy.login("Leder", "/timeadministrering", { users: [ ...employees, employer] });
    })

    it("Displays only employees and with full name", () => {
        let employeesAvailable = [...employees];
        listItems().each($el => {
            cy.wrap($el).should('not.contain', employer.firstName);
            let listItemEmployee: User;
            //Get employer that correlates to element
            const elString = $el.text();
            for(const [index, employee] of employeesAvailable.entries()){
                if(elString.indexOf(employee.firstName!) != -1){
                    listItemEmployee = employee;
                    employeesAvailable.splice(index, 1); //Remove from array to ensure no duplicates are giving false positives.
                    break;
                }
            }  
            expect(listItemEmployee!).to.exist;
            cy.wrap($el).should('contain', listItemEmployee!.firstName)
            cy.wrap($el).should('contain', listItemEmployee!.lastName)
        })
    })

    it("List item links to employer timesheet week list", () => {
        listItems().first().click();
        cy.url().should('contain', '/timeadministrering/uker')
    })
})