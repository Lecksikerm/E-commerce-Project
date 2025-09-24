"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o)
                if (Object.prototype.hasOwnProperty.call(o, k))
                    ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k = ownKeys(mod), i = 0; i < k.length; i++)
                if (k[i] !== "default")
                    __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../src/dal/entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
async function ensureAdmin() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: 'localhost', // your DB host
        port: 5432, // your DB port
        username: 'postgres', // your DB user
        password: 'postgres', // your DB password
        database: 'e-commerce', // your DB name
        entities: [user_entity_1.User],
        synchronize: false, // false in production
    });
    await dataSource.initialize();
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const adminId = '9428d83c-5087-4141-87e0-49bf6b0f6d20';
    let admin = await userRepo.findOneBy({ id: adminId });
    if (!admin) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10); // choose a secure password
        admin = userRepo.create({
            id: adminId,
            email: 'admin1@gmail.com',
            username: 'admin1',
            password: hashedPassword,
            role: 'admin',
            name: 'Admin User',
        });
        await userRepo.save(admin);
        console.log(' Admin user created successfully');
    }
    else {
        console.log(' Admin already exists');
    }
    await dataSource.destroy();
}
ensureAdmin().catch(console.error);
//# sourceMappingURL=ensure-admin.js.map