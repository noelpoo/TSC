/// <reference types="cypress" />

import * as common from "../../support/common";
import * as constants from "../../support/constants"

describe('Create new articles', () => {
    const validUser = constants.inUseUsers[0]

    // TEST EDITOR PAGE IS NOT ACCESSIBLE WHEN LOGGED OUT
    it('Test editor page not accessible when logged out', () => {
        cy.visit(constants.urls.editor);
        cy.url('eq', constants.urls.homepage);
    })

    // INSPECT EDITOR PAGE
    it('Inspect editor page after logging in with valid user credentials', () => {
        cy.visit(constants.urls.login);
        cy.login(validUser.email, validUser.password)
        cy.url('eq', constants.urls.homepage);
        cy.get('.nav-link[href="/editor"]').then((el) => {
            cy.get(el).click();
        })
        cy.url('eq', constants.urls.editor);

        cy.get('.form-control[type="text"][placeholder="Article title"]').should('be.visible');
        cy.get('.form-control[type="text"][placeholder="What is this article about?"]').should('be.visible');
        cy.get('.form-control[rows="8"][placeholder="Write your article (in markdown)"]').should('be.visible');
        cy.get('.form-control[type="text"][placeholder="Enter tags"]').should('be.visible');
        cy.get('button[type="button"]').contains('Publish article').should('be.visible');
    })

    // TEST PUBLISHING ARTICLE WITH NO TITLE, DESC, BODY AND TAGS
    it('Publishing article - missing title, body, tag and description', ()=> {
        cy.loginAndEnterEditor(validUser.email, validUser.password);
        cy.get('button[type="button"]').contains('Publish article').click();
        cy.shouldContainErrorMessage('Name is required');
        cy.shouldContainErrorMessage('Description is required');
        cy.shouldContainErrorMessage('Body is required');
    })
    
    // TEST PUBLISHING ARTICLE WITH MISSING TITLE
    it('Publishing article - missing title', ()=> {
        cy.loginAndEnterEditor(validUser.email, validUser.password);
        cy.publishArticle(
            "",
            common.generateRandomStringOfLength(10),
            common.generateRandomStringOfLength(10),
            common.generateRandomStringOfLength(5)
        );
        cy.shouldContainErrorMessage('Name is required');
    })

    // TEST PUBLISHING ARTICLE WITH MISSING DESCRIPTION
    it('Publishing article - missing description', ()=> {
        cy.loginAndEnterEditor(validUser.email, validUser.password);
        cy.publishArticle(
            common.generateRandomStringOfLength(5),
            "",
            common.generateRandomStringOfLength(10),
            common.generateRandomStringOfLength(5)
        );
        cy.shouldContainErrorMessage('Description is required');
        })
    
    // TEST PUBLISHING ARTICLE WITH MISSING BODY
    it('Publishing article - missing body', () => {
        cy.loginAndEnterEditor(validUser.email, validUser.password);
        cy.publishArticle(
            common.generateRandomStringOfLength(5),
            common.generateRandomStringOfLength(10),
            "",
            common.generateRandomStringOfLength(5)
        )
        cy.shouldContainErrorMessage('Body is required');
    })

    // TEST PUBLISHING ARTICLE WITH TOO SHORT BODY
    it('Publishing artile - too short body', () => {
        cy.loginAndEnterEditor(validUser.email, validUser.password);
        cy.publishArticle(
            common.generateRandomStringOfLength(5),
            common.generateRandomStringOfLength(10),
            common.generateRandomStringOfLength(2),
            common.generateRandomStringOfLength(5),
        )
        cy.shouldContainErrorMessage('Body is too short');
    })

    // TEST PUBLISHING ARTICLE WITH MISSING TAG
    it('Publishing article - missing tag', () => {
        const title = common.generateRandomStringOfLength(5);
        const desc = common.generateRandomStringOfLength(10);
        const body = common.generateRandomStringOfLength(10);
        cy.intercept('POST', `${constants.apiUrl}/articles`).as('articles')

        cy.loginAndEnterEditor(validUser.email, validUser.password);
        cy.publishArticle(
            title,
            desc,
            body,
            ""
        )
        cy.wait('@articles').then((resp) => {
            expect(resp.response.statusCode).to.equal(200);
            cy.url().should('include', `${constants.urls.homepage}/article`)
        })
        cy.get('h1').contains(title).should('be.visible');
        cy.get('p').contains(body).should('be.visible');
    })

    // TEST PUBLISHING ARTICLE 
    it('Publishing article - with title, desc, valid body and tag', () => {
        const title = common.generateRandomStringOfLength(5);
        const desc = common.generateRandomStringOfLength(10);
        const body = common.generateRandomStringOfLength(10);
        const tag = common.generateRandomStringOfLength(5);
        cy.intercept('POST', `${constants.apiUrl}/articles`).as('articles')

        cy.loginAndEnterEditor(validUser.email, validUser.password);
        cy.publishArticle(
            title,
            desc,
            body,
            tag
        )
        cy.wait('@articles').then((resp) => {
            expect(resp.response.statusCode).to.equal(200);
            cy.url().should('include', `${constants.urls.homepage}/article`)
            cy.get('h1').contains(title).should('be.visible');
            cy.get('p').contains(body).should('be.visible');
        })
    })
})