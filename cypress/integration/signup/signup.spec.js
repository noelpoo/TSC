/// <reference types="cypress" />

import * as common from "../../support/common";
import * as constants from "../../support/constants"

describe('signing up - HTML web form', () => {
    const user = common.generateNewUserObj();

    before(() => {
        cy.intercept('POST', `${constants.apiUrl}/users`).as('signup')
    })

    beforeEach(()=> {
        cy.visit(constants.urls.signup);
    })

    // INSPECT SIGN UP PAGE ELEMENTS
    it('Inspect signup page - input elements exists', () => {
        cy.get('input[type="text"][placeholder="Your name"]').should('exist');
        cy.get('input[type="email"][placeholder="Email"]').should('exist');
        cy.get('input[type="password"][placeholder="Password"]').should('exist');
        cy.get('button[type="button"]').contains('Sign up').should('exist');
    })


    // TEST FRONT END INPUT VALIDATION FOR INVALID EMAIL
    it('Test frontend validation - Signup with invalid email', () => {
        cy.signup(user.name, common.generateInvalidEmail(), user.password);
        cy.shouldContainErrorMessage('Email is invalid');
    })

    // TEST BACKEND INPUT VALIDATION FOR INVALID EMAIL
    it('Test backend validation - Signup with invalid email', () => {
        cy.intercept('POST', `${constants.apiUrl}/users`).as('signup')

        cy.signup(user.name, `${common.generateRandomStringOfLength(5)}@${common.generateRandomStringOfLength(5)}`, user.password);
        cy.wait('@signup')
        .then(
            (resp) => {
                const resp_status = resp.response.statusCode;
                expect(resp_status).to.equal(422);
                cy.shouldContainErrorMessage('email is invalid');
            }
        )
    })

    // TEST BACKEND INPUT VALIDATION FOR USED USERNAME
    it('Test backend validation - signing up with in-used username', () => {
        cy.intercept('POST', `${constants.apiUrl}/users`).as('signup')

        const newValidEmail = common.generateValidEmail();
        cy.signup(constants.inUseUsers[0].name, newValidEmail, constants.inUseUsers[0].password);
        cy.wait('@signup')
        .then(
            (resp) => {
                const resp_status = resp.response.statusCode;
                expect(resp_status).to.equal(422);
                cy.shouldContainErrorMessage('username has already been taken');
            }
        )
    })

    // TEST BACKEND INPUT VALIDATION FOR INVALID SHORT PASSWORD LENGTH
    it('Test backend validation - signing up with invalid too-short-password', () => {
        cy.intercept('POST', `${constants.apiUrl}/users`).as('signup');

        const newUser = common.generateNewUserObj()
        const invalidPW = common.generateRandomStringOfLength(7);
        cy.signup(newUser.name, newUser.email, invalidPW);
        cy.wait('@signup')
        .then(
            (resp) => {
                const resp_status = resp.response.statusCode;
                expect(resp_status).to.equal(422);
                cy.shouldContainErrorMessage('password is too short (minimum is 8 characters)');
            }
        )
    })

    // TEST FRONTEND INPUT VALIDATION FOR INVALID LONG PASSWORD LENGTH
    it('Test frontend validation - signing up with invalid too-long-password', () => {
        const newUser = common.generateNewUserObj()
        const invalidPW = common.generateRandomStringOfLength(21);
        cy.signup(newUser.name, newUser.email, invalidPW);
        cy.shouldContainErrorMessage('Password is too long');
    })

    

    // SIGNING UP WITH VALID USER CREDENTIALS
    it('Sign up with random valid user', ()=> {
        cy.intercept('POST', `${constants.apiUrl}/users`).as('signup')

        cy.signup(user.name, user.email, user.password);
        console.log(Math.floor(Math.random() * 1.1));

        cy.wait('@signup')
        .then(
            (resp) => {
                const resp_status = resp.response.statusCode;
                expect(resp_status).to.equal(200);
            }
        )
    })
})

