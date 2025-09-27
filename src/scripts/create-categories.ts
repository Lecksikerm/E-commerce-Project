// src/seeds/create-categories.ts
import { dataSource } from '../data-source';
import { Category } from '../dal/entities/category.entity';

async function seedCategories() {
    await dataSource.initialize();

    const categories = [
        'Electronics',
        'Fashion',
        'Groceries',
        'Home Appliances',
        'Sports',
        'Books',
        'Furniture',
        'Gaming',
        'Beauty',
        'Toys',
        'Office Supplies',
        'Pet Supplies',
        'Outdoor',
        'Health',
        'Jewelry',
        'Music',
        'Automotive',
    ];

    for (const name of categories) {
        const category = dataSource.getRepository(Category).create({
            name,
            description: `${name} products`,
        });
        await dataSource.getRepository(Category).save(category);
        console.log(`Created category: ${name} -> ID: ${category.id}`);
    }

    await dataSource.destroy();
}

seedCategories()
    .then(() => console.log(' Categories created'))
    .catch((err) => console.error(err));
