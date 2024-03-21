Cypress.Commands.add('eliminarProducto', (id) => {
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products?id=${id}`,
        failsOnStatusCode: false,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    }).its('body.products.docs').each((product) => {
        cy.request({
            method: "DELETE",
            url: `${Cypress.env().baseUrlAPI}/product/${product._id}`,
            headers: {
                Authorization: `Bearer ${Cypress.env().token}`,
            }
        });
    });

});

Cypress.Commands.add('crearProducto', (body) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env().baseUrlAPI}/create-product`,
        body: body,
    })
});

Cypress.Commands.add('editarProducto', (body) => {
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products?id=${body.id}`,
        failsOnStatusCode: false,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    }).its('body.products.docs').each((product) => {
        cy.request({
            method: "PUT",
            url: `${Cypress.env().baseUrlAPI}/product/${product._id}`,
            failsOnStatusCode: false,
            body: {
                img:body.img,
                name:body.name,
                price:body.price
            },
            headers: {
                Authorization: `Bearer ${Cypress.env().token}`
            }
        });
    });

});