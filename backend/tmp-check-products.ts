import mongoose from 'mongoose';
import Product from './server/models/Product';
import { getMongoUri } from './server/config/mongo';

(async () => {
  try {
    await mongoose.connect(getMongoUri());
    const count = await Product.countDocuments({ isActive: true });
    console.log('PRODUCT_COUNT', count);
    const docs = await Product.find({ isActive: true }).limit(5).lean();
    console.log(JSON.stringify(docs, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
