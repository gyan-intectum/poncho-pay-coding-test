import * as Sequelize from 'sequelize';
import * as uuid from 'uuid';

export async function up(queryInterface: Sequelize.QueryInterface): Promise<void>
{
  await queryInterface.bulkInsert('products',
  [
    {
      id: uuid.v4(),
      name: 'Test Product 1',
      description: 'I consider myself described',
      price: 9.99,
      stockLevel: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}
