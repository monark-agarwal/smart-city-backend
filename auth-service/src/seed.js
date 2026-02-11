const sequelize = require('./db/connection');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

(async () => {

  await sequelize.sync({ alter: true });

  const adminPass = await bcrypt.hash('Admin@123', 10);
  const userPass = await bcrypt.hash('User@123', 10);

  await User.findOrCreate({
    where: { email: 'admin@smartcity.com' },
    defaults: {
      firstName: 'System',
      lastName: 'Admin',
      password: adminPass,
      role: 'admin'
    }
  });

  await User.findOrCreate({
    where: { email: 'user@smartcity.com' },
    defaults: {
      firstName: 'Test',
      lastName: 'User',
      password: userPass,
      role: 'user'
    }
  });

  console.log('Seed completed');

  process.exit(0);

})();
