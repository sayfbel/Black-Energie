const db = require('./config/db');

const products = [
    { name: 'Colombia Supremo | Single Origin Excellence by Black Energie', prices: { '250g': 18.00, '500g': 34.00, '1kg': 65.00 } },
    { name: 'Heavy Body | Premium Coffee Blend by Black Energie', prices: { '250g': 20.00, '500g': 38.00, '1kg': 72.00 } },
    { name: 'Brazil Velvet | Single Origin Smoothness by Black Energie', prices: { '250g': 17.00, '500g': 32.00, '1kg': 60.00 } },
    { name: 'Smooth Classic | Balanced Heritage Blend by Black Energie', prices: { '250g': 19.00, '500g': 36.00, '1kg': 68.00 } },
    { name: 'Strong Espresso | High-Performance Energy by Black Energie', prices: { '250g': 22.00, '500g': 42.00, '1kg': 80.00 } },
    { name: 'Aroma Light | Floral & Vibrant Blend by Black Energie', prices: { '250g': 21.00, '500g': 40.00, '1kg': 75.00 } }
];

const customerNames = [
    'Alexander Thorne', 'Elena Rostova', 'Julian Mercer', 'Sophia Sterling',
    'Marcus Vance', 'Amara Sinclair', 'Dorian Grey', 'Olivia Dupont',
    'Maximilian Cruz', 'Seraphina Finch', 'Cassian Drake', 'Isabella Sterling',
    'Gideon Ward', 'Vivienne Westwood', 'Tristan Vance', 'Aurelia Solis'
];

const cities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Agadir', 'Fes'
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
    try {
        console.log("Emptying orders table...");
        await db.query('DELETE FROM orders');
        await db.query('ALTER TABLE orders AUTO_INCREMENT = 1');
        
        console.log("Generating 100 mock orders across the last 30 days...");
        
        // Generate orders spread over 30 days
        const totalOrdersNeeded = 100;
        const orders = [];
        
        // Create an even distribution with some random fluctuation across 30 days
        for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
            // Determine number of orders for this day (average 3-4, ranging from 1 to 7)
            let dailyCount = Math.floor(Math.random() * 6) + 1;
            if (dayOffset === 29) {
                // Adjust last day to ensure we get exactly 100 orders total
                const currentCount = orders.length;
                const remaining = totalOrdersNeeded - currentCount;
                dailyCount = Math.max(remaining, 0);
            }
            
            for (let j = 0; j < dailyCount; j++) {
                if (orders.length >= totalOrdersNeeded) break;
                
                const product = getRandomItem(products);
                const weight = getRandomItem(['250g', '500g', '1kg']);
                const quantity = Math.floor(Math.random() * 2) + 1; // 1 or 2
                const pricePerItem = product.prices[weight];
                const totalPrice = pricePerItem * quantity;
                
                // Random status (mostly confirmed or pending, occasionally cancelled)
                const randStatus = Math.random();
                let status = 'confirmed';
                if (randStatus < 0.15) status = 'pending';
                else if (randStatus < 0.23) status = 'cancelled';
                
                // Calculate date for the dayOffset
                const date = new Date();
                date.setDate(date.getDate() - dayOffset);
                // Add a random hour/minute/second for realism
                date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
                
                const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
                
                orders.push({
                    product_name: product.name,
                    customer_name: getRandomItem(customerNames),
                    customer_whatsapp: '06' + Math.floor(10000000 + Math.random() * 90000000).toString(),
                    customer_address: `${Math.floor(Math.random() * 100) + 1} Avenue Hassan II, ${getRandomItem(cities)}`,
                    weight,
                    quantity,
                    total_price: totalPrice,
                    status,
                    created_at: formattedDate
                });
            }
        }
        
        // If we still need more orders to reach 100 (due to rounding)
        while (orders.length < totalOrdersNeeded) {
            const product = getRandomItem(products);
            const weight = getRandomItem(['250g', '500g', '1kg']);
            const quantity = 1;
            const totalPrice = product.prices[weight];
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
            
            orders.push({
                product_name: product.name,
                customer_name: getRandomItem(customerNames),
                customer_whatsapp: '06' + Math.floor(10000000 + Math.random() * 90000000).toString(),
                customer_address: `100 Rue de la Paix, Casablanca`,
                weight,
                quantity,
                total_price: totalPrice,
                status: 'confirmed',
                created_at: formattedDate
            });
        }

        console.log(`Inserting ${orders.length} orders into the database...`);
        for (const order of orders) {
            await db.query(`
                INSERT INTO orders (product_name, customer_name, customer_whatsapp, customer_address, weight, quantity, total_price, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                order.product_name,
                order.customer_name,
                order.customer_whatsapp,
                order.customer_address,
                order.weight,
                order.quantity,
                order.total_price,
                order.status,
                order.created_at
            ]);
        }
        
        console.log("Seeding complete! Database orders table has been populated successfully.");
        process.exit(0);
    } catch (err) {
        console.error("SEEDING FAILED:", err);
        process.exit(1);
    }
}

seed();
