const TODO_NAME = 'Buy milk';
const TODO_DESCRIPTION = '2% milk';
const TODO_DUE_DATE = '2020-12-31';

describe('Add todo page', () => {
	beforeEach(() => {
		cy.visit('/todo/add');
	});

	it('The cancel button should redirect you to the home page', () => {
		cy.get('[data-cy=cancel_add_todo_button]').click();
		cy.location('pathname').should('eq', '/');
	});

	it('Should be error when task name is not filled in', () => {
		// cy.get('[data-cy=task_name_add_todo_field]').type('Test');
		cy.get('[data-cy=description_add_todo_field]').type('Test');
		cy.get('[data-cy=date_add_todo_field]').type('2022-12-31');
		cy.get('[data-cy=submit_add_todo_button]').click({ force: true });

		cy.get('[data-cy=add_todo_error]').contains('Task name is required', {
			matchCase: false,
		});
	});

	it('Adding normal todo should work', () => {
		cy.get('[data-cy=task_name_add_todo_field]').type(TODO_NAME);
		cy.get('[data-cy=description_add_todo_field]').type(TODO_DESCRIPTION);
		cy.get('[data-cy=date_add_todo_field]').type(TODO_DUE_DATE);
		cy.get('[data-cy=submit_add_todo_button]').click({ force: true });

		cy.location('pathname').should('eq', '/');
		cy.get('[data-cy=todo_list]').contains(TODO_NAME);
		cy.get('[data-cy=todo_list]').contains(TODO_DESCRIPTION);
	});
});

export {};
