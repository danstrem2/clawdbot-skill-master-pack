const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const tenantId = args[0] || 'default';

const filePath = path.join(__dirname, '../../../../data/tenants', `${tenantId}.json`);

if (!fs.existsSync(filePath)) {
    console.error(`Error: Tenant '${tenantId}' not found at ${filePath}`);
    process.exit(1);
}

try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    console.log(`=== MENU FOR ${data.storeName} (${tenantId}) ===`);
    console.log('\n--- CATEGORIES ---');
    data.categories.forEach(cat => {
        console.log(`[${cat.id}] ${cat.name}`);
    });

    console.log('\n--- PRODUCTS ---');
    Object.keys(data.products).forEach(catId => {
        const products = data.products[catId];
        if (products && products.length > 0) {
            console.log(`\n> ${catId.toUpperCase()}:`);
            products.forEach(p => {
                console.log(`  - [${p.id}] ${p.name} | R$ ${p.price} | Active: ${p.active} | ${p.description}`);
            });
        }
    });

} catch (e) {
    console.error("Error reading/parsing menu:", e.message);
    process.exit(1);
}
