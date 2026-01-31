const fs = require('fs');
const path = require('path');

// Usage: node add_product.js <tenantId> <categoryId> <name> <price> <description>
const args = process.argv.slice(2);

if (args.length < 5) {
    console.log("Usage: node add_product.js <tenantId> <categoryId> <name> <price> <description>");
    process.exit(1);
}

const tenantId = args[0];
const categoryId = args[1];
const name = args[2];
const price = parseFloat(args[3]);
const description = args[4];

const filePath = path.join(__dirname, '../../../../data/tenants', `${tenantId}.json`);

if (!fs.existsSync(filePath)) {
    console.error(`Error: Tenant '${tenantId}' not found.`);
    process.exit(1);
}

try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.products[categoryId]) {
        // Check if category exists in definitions
        const catDef = data.categories.find(c => c.id === categoryId);
        if (!catDef) {
            console.error(`Error: Category '${categoryId}' does not exist. Please create it first.`);
            process.exit(1);
        }
        data.products[categoryId] = [];
    }

    const newId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const newProduct = {
        id: newId,
        name: name,
        description: description,
        price: price,
        oldPrice: null,
        badge: "",
        tags: [],
        image: "placeholder.jpg", // Default placeholder
        active: true,
        isPopular: false
    };

    data.products[categoryId].push(newProduct);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    console.log(`Success: Added '${name}' to '${categoryId}' (ID: ${newId})`);

} catch (e) {
    console.error("Error updating menu:", e.message);
    process.exit(1);
}
