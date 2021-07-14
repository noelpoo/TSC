import * as constants from "../support/constants";

Cypress.Commands.add('signup', (name, email, password) => {
    cy.get('input[type="text"][placeholder="Your name"]').type(name);
    cy.get('input[type="email"][placeholder="Email"]').type(email);
    cy.get('input[type="password"][placeholder="Password"]').type(password);
    cy.get('button[type="button"]').contains('Sign up').click();
})

Cypress.Commands.add('login', (email, password) => {
    cy.get('input[type="email"][placeholder="Email"]').type(email);
    cy.get('input[type="password"][placeholder="Password"]').type(password);
    cy.get('button[type="button"]').contains('Sign in').click();
})

Cypress.Commands.add('loginAndEnterSettings', (email, password) => {
    cy.intercept('POST', `${constants.apiUrl}/users/login`).as('login');

    cy.visit(constants.urls.login);
    cy.login(email, password);
    
    cy.wait('@login')
    .then((resp) => {
        const status_code = resp.response.statusCode;
        expect(status_code).to.equal(200);
        cy.visit(constants.urls.settings);
    })
})

Cypress.Commands.add('loginAndEnterEditor', (email, password) => {
    cy.visit(constants.urls.login)
    cy.login(email, password)
    cy.url('eq', constants.urls.homepage);
    cy.wait(1000);
    cy.visit(constants.urls.editor);
    cy.url('eq', constants.urls.editor);
})

Cypress.Commands.add('publishArticle', (title, desc, body, tag)=>{
    if(title){
        cy.get('.form-control[type="text"][placeholder="Article title"]')
        .type(title);
    }
    if (desc) {
        cy.get('.form-control[type="text"][placeholder="What is this article about?"]')
        .type(desc);
    }
    if (body) {
        cy.get('.form-control[rows="8"][placeholder="Write your article (in markdown)"]')
        .type(body);
    }
    if (tag){
        cy.get('.form-control[type="text"][placeholder="Enter tags"]')
        .type(tag);
    }
    cy.get('button[type="button"]').contains('Publish article').click();
})

Cypress.Commands.add('clearEditorFields', () => {
    cy.get('.form-control[type="text"][placeholder="Article title"]').clear();
    cy.get('.form-control[type="text"][placeholder="What is this article about?"]').clear();
    cy.get('.form-control[rows="8"][placeholder="Write your article (in markdown)"]').clear();
    cy.get('.form-control[type="text"][placeholder="Enter tags"]').clear();
})

Cypress.Commands.add('LoginAndPublishArticle', (validUser, title, desc, body, tag) => {

    cy.loginAndEnterEditor(validUser.email, validUser.password);
    cy.publishArticle(
        title,
        desc,
        body,
        tag
    )
    cy.url().should('include', `${constants.urls.homepage}/article`)
})

Cypress.Commands.add('shouldContainErrorMessage', (errorMessage) => {
    cy.get('.error-messages').contains(errorMessage).should('exist');
})