import supabaseClient from '../../database/supabaseClient';

describe('Home page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('Add todo button will redirect you to the add todo button page', () => {
		cy.get('[data-cy=add_todo_button]').click();
		cy.location('pathname').should('eq', '/todo/add');
	});

	// TODO: Do proper spec
	it('Refresh button should at least call the API one time', () => {
		cy.intercept('/api/todo').as('getTodos');
		cy.get('[data-cy=refresh_todos_button]').click();
		cy.wait('@getTodos');
	});

	it('Edit todo menu button works and should redirect the user to edit todo page', async () => {
		// TODO: Change to dynamic ID gotten from the database

		let { data: todo, error } = await supabaseClient
			.from('todo')
			.select('*')
			.order('created_at');

		console.log(todo[0]);

		const { id } = todo[0];

		// Simulate the clicking of the 3 dots first
		cy.get(`[data-cy=menu-${id}-todo-button]`).click({ force: true });

		// Then click the edit menu item
		cy.get(`[data-cy=edit-${id}-todo-button]`).click({ force: true });

		// Check for the pathname to be /todo/edit/:id
		cy.location('pathname').should('eq', `/todo/edit/${id}`);
	});
});
