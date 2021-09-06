import { ApiUrl } from "@core/api-url.enum";
import { Employer, User } from "@core/models";
import { Roles } from "@core/roles.enum";

describe('User List', () => {

    const employer : Employer = {id:'emp', name: 'bse'}

    const usersInDescendingRole : User[] = [
        { 
            userName: "test1", firstName: "first1", lastName: "last1", phoneNumber: "322321",
            role: Roles.Leder
        },
        { 
            userName: "test2", firstName: "first2", lastName: "last2", phoneNumber: "35521",
            role: Roles.Mellomleder
        },
        { 
            userName: "test3", firstName: "first3", lastName: "last3", phoneNumber: "37321",
            role: Roles.Ansatt
        },
        { 
            userName: "test4", firstName: "first4", lastName: "last4", phoneNumber: "32111",
            role: Roles.Oppdragsgiver, employerId: employer.id
        }
    ]

    const adminUser : User =   { 
        userName: "admin", firstName: "uniqueadmin", lastName: "admin", phoneNumber: "admin",
        role: Roles.Admin
    }

    const listItems = () => cy.getCy("user-list-card");

    beforeEach(() => {
        cy.intercept('GET', '**' + ApiUrl.Users, { statusCode: 204, delay: 1000 }); 
        cy.login(Roles.Leder, "/brukere", { users: [...usersInDescendingRole, adminUser].reverse() })  
    })

    it('Should not show admin users', () => {
        listItems().filter(`:contains("${adminUser.firstName}")`).should('have.length', 0);
    })

    it('Should display users correctly and in decending role', () => {
        listItems().should('have.length', usersInDescendingRole.length);
        listItems().each(($el, i) => {
            const user = usersInDescendingRole[i];
            cy.wrap($el).should('contain', user.firstName)
                .and('contain', user.lastName)
                .and('contain', user.role === Roles.Oppdragsgiver ? 'work' : 'person')
                .find('a').invoke('attr', 'href').should('contain', user.phoneNumber)    
        })
    })

    it('Can open forms', () => {
        const assertSheet = () => cy.url().should('contain', 'sheet=true').closeForm();
        
        cy.mainFabClick();
        assertSheet();
        cy.getCy('new-password-button').eq(0).click();
        assertSheet();
        cy.getCy('edit-button').eq(0).click();
        assertSheet();
    })

});