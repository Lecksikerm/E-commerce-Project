import 'reflect-metadata';
import { dataSource } from '../data-source';
import { Product } from '../dal/entities/product.entity';
import { Category } from '../dal/entities/category.entity';
import { IsNull } from 'typeorm';

async function assignCategories() {
  await dataSource.initialize();
  console.log('Database connected');

  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(Category);

  // Fetch all categories
  const categories = await categoryRepo.find();
  if (categories.length === 0) {
    console.error('No categories found in database. Run create-categories.ts first.');
    await dataSource.destroy();
    return;
  }

  const productsWithoutCategory = await productRepo.find({
    where: { category: IsNull() }, 
  });

  if (productsWithoutCategory.length === 0) {
    console.log('All products already have categories assigned.');
    await dataSource.destroy();
    return;
  }

  console.log(`Found ${productsWithoutCategory.length} products without category. Assigning now...`);

  for (const product of productsWithoutCategory) {
   
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    product.category = randomCategory;
    await productRepo.save(product);
    console.log(`Assigned category "${randomCategory.name}" to product "${product.name}"`);
  }

  console.log('Category assignment completed!');
  await dataSource.destroy();
}

assignCategories().catch((err) => {
  console.error('Error assigning categories:', err);
  dataSource.destroy();
});


