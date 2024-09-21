import * as Sequelize from 'sequelize';

export async function up(queryInterface: Sequelize.QueryInterface): Promise<void>
{
  await queryInterface.createTable('products',
  {
    id: { type: Sequelize.UUID, primaryKey: true, unique: true, defaultValue: Sequelize.UUIDV4 },
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING, allowNull: false },
    price: { type: Sequelize.FLOAT, allowNull: false },
    stockLevel: { type: Sequelize.INTEGER, allowNull: false },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
  },
  {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  } as any);

  await queryInterface.createTable('payments',
  {
    id: { type: Sequelize.UUID, primaryKey: true, unique: true, defaultValue: Sequelize.UUIDV4 },
    amount: { type: Sequelize.FLOAT, allowNull: false },
    status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'initialised' },
    paymentMethod: { type: Sequelize.STRING },
    user: { type: Sequelize.STRING },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
    productId: { type: Sequelize.UUID, allowNull: false,
      references: { model: 'products', key: 'id' }, onUpdate: 'cascade' }
  },
  {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  } as any);
}

export async function down(queryInterface: Sequelize.QueryInterface): Promise<void>
{
  await queryInterface.dropTable('products');
  await queryInterface.dropTable('payments');
}
