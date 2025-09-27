import { dataSource } from '../data-source';
import { Admin } from '../dal/entities/admin.entity';
import { Category } from '../dal/entities/category.entity';

async function assignCategoryAdmin() {
    
    await dataSource.initialize();

    const adminRepo = dataSource.getRepository(Admin);
    const categoryRepo = dataSource.getRepository(Category);


    const admin = await adminRepo.findOneBy({});
    if (!admin) {
        console.error('No admin found. Please create an admin first.');
        process.exit(1);
    }


    const categories = await categoryRepo.find();


    for (const category of categories) {
        (category as any).createdBy = admin;
    }

    await categoryRepo.save(categories);

    console.log(`Assigned admin ${admin.email} to all categories`);

    await dataSource.destroy();
}

assignCategoryAdmin().catch((err) => {
    console.error(' Error assigning admin to categories:', err);
    process.exit(1);
});


