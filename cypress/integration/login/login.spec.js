/// <reference types="cypress" />

import * as common from "../../support/common";
import * as constants from "../../support/constants"

describe('logging in - HTML web form page', () => {
    const user = constants.inUseUsers[0];
    
    beforeEach(() => {
        cy.visit(constants.urls.login);
    })

    // INSPECT LOG IN PAGE ELEMENTS
    it('Inspect log in page - input elements exist', () => {
        cy.get('input[type="email"][placeholder="Email"]').should('exist');
        cy.get('input[type="password"][placeholder="Password"]').should('exist');
        cy.get('button[type="button"]').contains('Sign in').should('exist');
    })

    // TEST FRONT END VALIDATION FOR INPUTS
    it('Test front end validation - logging in using malformed email', () => {
        const malformedEmail = common.generateRandomStringOfLength(8);
        cy.login(malformedEmail, user.password);
        cy.shouldContainErrorMessage('Email is invalid');
    }) 

    // TEST BACKEND VALIDATION WITH INVALID USER CREDENTIALS
    it('Test back end validation - loggin in using existing user but wrong password', () => {
        cy.intercept('POST', `${constants.apiUrl}/users/login`).as('login')

        const wrongPw = common.generateRandomStringOfLength(10);
        cy.login(user.email, wrongPw);

        cy.wait('@login')
        .then(
            (resp) => {
                const status_code = resp.response.statusCode;
                expect(status_code).to.equal(422);
                cy.shouldContainErrorMessage('email or password is invalid');
            }
        )
    })

    // TEST WITH VALID USER CREDENTIALS
    it('Test login - logging in using valid existing user credentials', () => {
        cy.intercept('POST', `${constants.apiUrl}/users/login`).as('login');

        cy.login(user.email, user.password);

        cy.wait('@login')
        .then(
            (resp) => {
                const status_code = resp.response.statusCode;
                expect(status_code).to.equal(200);
                cy.get('.nav-link').contains(user.name).should('exist');
                cy.url().should('eq', `${constants.urls.homepage}/`);
            }
        )
    })

})