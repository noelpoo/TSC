/// <reference types="cypress" />

import * as common from "../../support/common";
import * as constants from "../../support/constants"

describe('Editing articles', () => {
    const validUser = constants.inUseUsers[0]


    // TEST PUBLISHING A NEW ARTICLE AND EDITING IT
    it('Publish new article and edit', () => {
        const article = common.generateNewArticle()
        const newArticle = common.generateNewArticle()

        cy.intercept('PUT', `${constants.apiUrl}/articles/*`).as('putArticle');

        cy.LoginAndPublishArticle(validUser, article.title, article.desc, article.body, article.tag);
        cy.get('.container > .article-meta > :nth-child(3) > .btn-outline-secondary').should('exist').click();
        cy.url().should("include", constants.urls.editor);
        
        cy.get('.form-control[placeholder="Article title"]').should('have.value', article.title);
        cy.get('.form-control[placeholder="What is this article about?"]').should('have.value', article.desc);
        cy.get('.form-control[rows="8"]').should('have.value', article.body);

        cy.clearEditorFields();
        cy.publishArticle(
            newArticle.title,
            newArticle.desc,
            newArticle.body,
            newArticle.tag
        );

        // VALIDATE API RESPONSE, PUT REQUEST
        cy.wait('@putArticle').then((resp) => {
            expect(resp.response.statusCode).to.equal(200);
            cy.url().should('include', `${constants.urls.homepage}/article`)
            cy.get('h1').contains(newArticle.title).should('be.visible');
            cy.get('p').contains(newArticle.body).should('be.visible');
        })
    })

    // TEST EDITING AN ALREADY CREATED ARTICLE
    it('Editing an already created article', () => {
        const article = common.generateNewArticle()
        const newArticle = common.generateNewArticle()

        cy.intercept('PUT', `${constants.apiUrl}/articles/*`).as('putArticle');
        cy.LoginAndPublishArticle(validUser, article.title, article.desc, article.body, article.tag);

        cy.get('.nav-link').contains(validUser.name).click();
        cy.get('.preview-link').contains(article.title).should('be.visible').click();

        // START EDITING
        cy.get('.container > .article-meta > :nth-child(3) > .btn-outline-secondary').should('exist').click();
        cy.url().should("include", constants.urls.editor);
        cy.clearEditorFields();
        cy.publishArticle(
            newArticle.title,
            newArticle.desc,
            newArticle.body,
            newArticle.tag
        )

        // VALIDATE API RESPONSE, PUT REQUEST
        cy.wait('@putArticle').then((resp) => {
            expect(resp.response.statusCode).to.equal(200);
            cy.url().should('include', `${constants.urls.homepage}/article`)
            cy.get('h1').contains(newArticle.title).should('be.visible');
            cy.get('p').contains(newArticle.body).should('be.visible');
        })
    })

    // TEST EDITING AN ALREADY CREATED ARTICLE - MISSING FIELDS
    it('Editing an already created article with missing fields', () => {
        const article = common.generateNewArticle()

        cy.intercept('PUT', `${constants.apiUrl}/articles/*`).as('putArticle');
        cy.LoginAndPublishArticle(validUser, article.title, article.desc, article.body, article.tag);

        cy.get('.nav-link').contains(validUser.name).should('be.visible').click();
        cy.get('.preview-link').contains(article.title).should('be.visible').click();

        cy.get('.container > .article-meta > :nth-child(3) > .btn-outline-secondary').should('exist').click();
        cy.url().should("include", constants.urls.editor);
        cy.clearEditorFields();
        cy.shouldContainErrorMessage('Name is required');
        cy.shouldContainErrorMessage('Description is required');
        cy.shouldContainErrorMessage('Body is required');
    })
})