/// <reference types="cypress" />

import * as common from "../../support/common";
import * as constants from "../../support/constants"

describe("Deleting articles", () => {
    const validUser = constants.inUseUsers[0]
    let articles = []
    for (let i = 0; i < 3; i ++){
        articles.push(common.generateNewArticle())
    }

    beforeEach(() => {
        cy.visit(constants.urls.login);
        cy.login(validUser.email, validUser.password);
        cy.wait(1000);
    })

    // TEST CREATING AND DELETING SINGLE ARTICLE AND EXPECT ARTICLE URL TO RETURN 404
    it('Creating and deleting single article', () => {
        const article = common.generateNewArticle();
        cy.intercept('DELETE', `${constants.apiUrl}/articles/*`).as('delete');
        
        cy.visit(constants.urls.editor);
        cy.publishArticle(article.title, article.desc, article.body, article.tag);
        cy.url().should('include', `${constants.urls.homepage}/article`)
        cy.get('h1').contains(article.title).should('be.visible');
        cy.get('p').contains(article.body).should('be.visible');

        cy.url().then((urlString)=>{
            cy.get('.btn.btn-outline-danger.btn-sm').contains(' Delete Article').click()
            cy.wait('@delete').then((resp) => {
                expect(resp.response.statusCode).to.equal(200);
            })
            cy.wait(1000);
            cy.intercept('GET', `${constants.apiUrl}/articles/*`).as('getArticle');
            cy.visit(urlString);
            cy.wait('@getArticle').then((resp) => {
                expect(resp.response.statusCode).to.equal(404);
            })
        })
    })

    // TEST CREATING MULTIPLE ARTICLES AND DELETING THEM
    it('Creating multiple articles and deleting them', () => {
        cy.intercept('DELETE', `${constants.apiUrl}/articles/*`).as('delete');

        // CREATING ARTICLES
        articles.forEach((article) => {
            cy.visit(constants.urls.editor)
            cy.publishArticle(article.title, article.desc, article.body, article.tag);
            cy.url().should('include', `${constants.urls.homepage}/article`)
            cy.get('h1').contains(article.title).should('be.visible');
            cy.get('p').contains(article.body).should('be.visible');
           
        })
        
        // DELETING EACH ARTICLE
        articles.forEach((article) => {
            cy.visit(`${constants.urls.profile}/${validUser.name}`);
            cy.get('.preview-link').contains(article.title).should('be.visible').click()
            cy.get('.btn.btn-outline-danger.btn-sm').contains(' Delete Article').click()
            cy.wait('@delete').then((resp) => {
                expect(resp.response.statusCode).to.equal(200);
            })
        })

        // CHECKING THAT DELETED TITLES DO NOT EXIST ON THE DOM
        cy.visit(`${constants.urls.profile}/${validUser.name}`);
        articles.forEach((article) => {
            cy.get('.preview-link').contains(article.title).should('not.exist');
        })


    })
})