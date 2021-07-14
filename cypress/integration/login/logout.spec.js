/// <reference types="cypress" />

import * as common from "../../support/common";
import * as constants from "../../support/constants"

describe('logging out', () => {

    const validUser = constants.inUseUsers[0]

    // TEST SETTINGS PAGE IS NOT ACCESSIBLE WHEN LOGGED OUT
    it('Test setting page not accessible when logged out', () => {
        cy.visit(constants.urls.settings);
        cy.url('eq', constants.urls.homepage);
    })

    // INSPECT SETTINGS PAGE - INPUT ELEMENTS AND BUTTONS
    it('Inpect settings page after logging in', () => {
        cy.loginAndEnterSettings(validUser.email, validUser.password);
        cy.get('input[type="text"][placeholder="URL of profile picture"]').should('exist');
        cy.get('input[type="text"][placeholder="Your name"]').should('exist')
        .and('have.value', validUser.name);
        cy.get('textarea[rows="8"][placeholder="Short bio about you"]').should('exist');
        cy.get('input[type="email"][placeholder="Email"]').should('exist')
        .and('have.value', validUser.email);
        cy.get('input[type="password"][placeholder="Password"]').should('exist');
        cy.get('button[type="button"]').contains('Update settings').should('exist');
        cy.get('button[type="button"]').contains('Log out').should('exist');
    })

    // TEST LOG OUT FLOW
    it('Test log out flow', () => {
        cy.loginAndEnterSettings(validUser.email, validUser.password);
        cy.get('button[type="button"]').contains('Log out').click();
        cy.url('eq', constants.urls.homepage);
        cy.get('.nav-link').contains('Sign in').should('be.visible');
        cy.get('.nav-link').contains('Sign up').should('be.visible');
    })
})