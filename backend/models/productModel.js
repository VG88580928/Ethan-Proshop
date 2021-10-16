import mongoose from 'mongoose';

// schema 是用 JSON 的方式來告訴 mongo 說 document 的資料會包含哪些型態。
// schema 會自動生成 unique id
const reviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // 單個星星數
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    // 由於只有 admin 可以創建商品，建立 user 是為了知道哪個 admin 創建了哪個商品，這邊用 ref
    // 讓  product schema 連結 User schema，引用了 User schema 的 id，refs 允許數據填充。
    // 因此我們不僅可以在查詢中獲取 'ref' 的 objectid，也可以取得該 'ref' 所屬的整個 document。
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // 由於一個商品可以有多條評論，故使用array來儲存
    reviews: [reviewSchema],
    // 平均星星數
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// model() 把 Schema 編譯成 Model，Model 可以用來創建以及操作 Mongo 的 collections
// (此處創建名為 products 的 collection)
const Product = mongoose.model('Product', productSchema);

export default Product;
