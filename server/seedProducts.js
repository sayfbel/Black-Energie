const db = require('./config/db');
const fs = require('fs');
const path = require('path');

const products = [
    {
        name: 'Obsidian Reserve',
        slug: 'obsidian-reserve',
        price: 34.99,
        description: 'A deep, dark roast with notes of molten chocolate and smoky oak. Sourced from the volcanic soils of Guatemala, this blend is for those who appreciate intensity and depth.',
        imageSource: 'C:\\Users\\saif\\.gemini\\antigravity\\brain\\51b07695-ae67-4453-b786-ac510e4e87ff\\coffee_product_1_obsidian_1778355061774.png'
    },
    {
        name: 'Ethiopian Gold',
        slug: 'ethiopian-gold',
        price: 29.50,
        description: 'Bright and floral with a distinct bergamot aroma. This single-origin Yirgacheffe is lightly roasted to preserve its delicate citrus notes and tea-like finish.',
        imageSource: 'C:\\Users\\saif\\.gemini\\antigravity\\brain\\51b07695-ae67-4453-b786-ac510e4e87ff\\coffee_product_2_ethiopian_1778355085211.png'
    },
    {
        name: 'Midnight Velvet',
        slug: 'midnight-velvet',
        price: 32.00,
        description: 'Silky smooth and incredibly balanced. A medium-dark roast with hints of black cherry and a toasted almond aroma. Perfect for evening indulgence.',
        imageSource: 'C:\\Users\\saif\\.gemini\\antigravity\\brain\\51b07695-ae67-4453-b786-ac510e4e87ff\\coffee_product_3_midnight_1778355111581.png'
    },
    {
        name: 'Golden Peak Roast',
        slug: 'golden-peak-roast',
        price: 27.99,
        description: 'Hailing from the high altitudes of Colombia, this roast delivers a classic profile with caramel sweetness and a crisp apple acidity.',
        imageSource: 'C:\\Users\\saif\\.gemini\\antigravity\\brain\\51b07695-ae67-4453-b786-ac510e4e87ff\\coffee_product_4_golden_roast_1778355129597.png'
    },
    {
        name: 'Velvet Horizon',
        slug: 'velvet-horizon',
        price: 31.25,
        description: 'A complex blend of African and South American beans. Features a rich, velvety body with surprising notes of spice and sun-dried fruit.',
        imageSource: 'C:\\Users\\saif\\.gemini\\antigravity\\brain\\51b07695-ae67-4453-b786-ac510e4e87ff\\coffee_product_5_velvet_blend_1778355143188.png'
    },
    {
        name: 'Emerald Mist',
        slug: 'emerald-mist',
        price: 38.00,
        description: 'Rare micro-lot coffee from Costa Rica. This honey-processed coffee offers a unique sweetness reminiscent of cane sugar and ripe melon.',
        imageSource: 'C:\\Users\\saif\\.gemini\\antigravity\\brain\\51b07695-ae67-4453-b786-ac510e4e87ff\\coffee_product_6_emerald_peak_1778355158267.png'
    }
];

const seed = async () => {
    try {
        console.log('Starting seed process...');
        const uploadDir = path.join(__dirname, 'uploads');
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        for (const p of products) {
            let imageUrl = null;
            if (fs.existsSync(p.imageSource)) {
                const fileName = `seed-${Date.now()}-${p.slug}.png`;
                const targetPath = path.join(uploadDir, fileName);
                fs.copyFileSync(p.imageSource, targetPath);
                imageUrl = `http://localhost:5000/uploads/${fileName}`;
                console.log(`Copied image for ${p.name}`);
            } else {
                console.warn(`Source image not found for ${p.name}: ${p.imageSource}`);
            }

            await db.query(
                'INSERT INTO products (name, slug, price, description, image_url) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE price=VALUES(price), description=VALUES(description), image_url=VALUES(image_url)',
                [p.name, p.slug, p.price, p.description, imageUrl]
            );
            console.log(`Inserted/Updated product: ${p.name}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
};

seed();
