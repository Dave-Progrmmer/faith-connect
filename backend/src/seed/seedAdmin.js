import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';

// Seed admin user
const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if any users exist
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('⚠️  Users already exist. Skipping admin seed.');
      console.log('💡 To create additional admins, use the register endpoint with admin credentials.');
      process.exit(0);
    }

    // Get admin credentials from environment
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@faithconnect.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.SEED_ADMIN_NAME || 'Super Admin';

    // Create admin user
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role:', admin.role);
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');
    console.log('\n🚀 You can now start the server and login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

// Run seed
seedAdmin();