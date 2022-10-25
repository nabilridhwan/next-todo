describe('Edit page', () => {
	it('Going to a page with incorrect UUID / Not UUID will redirect me to the home page', () => {
		cy.visit('/todo/edit/123');
		cy.location('pathname').should('eq', '/');
	});

	it('Going to a edit page for a todo should work and have no redirects', () => {
		cy.visit('/todo/edit/f5b1d2cf-8ab7-4b9f-925e-dd775aafe215');
	});

	it('Clearing the task name and submitting should show an error', () => {
		cy.visit('/todo/edit/f5b1d2cf-8ab7-4b9f-925e-dd775aafe215');

		cy.get('[data-cy=task_name_edit_todo_field]').clear();
		cy.get('[data-cy=submit_edit_todo_button]').click({ force: true });

		cy.get('[data-cy=edit_todo_error]').contains('Task name is required', {
			matchCase: false,
		});
	});
});

export {};
