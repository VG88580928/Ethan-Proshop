import asyncHandler from 'express-async-handler'; //讓我們不用一直重複寫 try-catch (Express 5.0 alpha 版本不需要) 原理:https://stackoverflow.com/questions/67404243/how-does-this-asynchandler-function-work(回答二樓)
import Product from '../models/productModel.js';

// @描述: 獲取所有商品 (因為做了商品分頁後，本來做的搜尋欄 auto-complete 功能爆掉了(只抓的到當前頁面的產品)，因此加開此 api)
// @route: GET /api/products/all
// @使用權: Public
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// @描述: 獲取所有商品 (有商品分頁)
// @route: GET /api/products
// @使用權: Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 2;
  const page = Number(req.query.pageNumber) || 1;
  const sortBy = req.query.sort_by || '';

  // req.query.keyword: 拿到 url 後面 ?keyword=value 中的 value，$regex: req.query.keyword => 找到名字包含 req.query.keyword 字串的商品，$options:'i' => 不區分大小寫
  // 來源: https://docs.mongodb.com/manual/reference/operator/query/regex/

  // &or 滿足任一就回傳
  // 來源: https://docs.mongodb.com/manual/reference/operator/query/or/#op._S_or
  const keyword = req.query.keyword
    ? {
        $or: [
          {
            name: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
          {
            category: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  // 寫法參考: https://stackoverflow.com/questions/4299991/how-to-sort-in-mongoose
  const sortProducts =
    sortBy === 'price-ascending'
      ? { price: 1 } // 價格低到高
      : sortBy === 'price-descending'
      ? { price: -1 } // 價格高到低
      : { _id: -1 }; // _id: -1 表示商品從新到舊

  // 要是有接收到 req.query.keyword，keyword 會長得像這樣 { '$or': [ { name: [Object] }, { category: [Object] } ] }，裡面裝有 filter 的條件(品名，種類等是否符合)

  let count = await Product.countDocuments({ ...keyword }); // countDocuments(): 符合這個 filter 條件的 documents 數量 (https://docs.mongodb.com/manual/reference/method/db.collection.countDocuments/)

  // 假設今天我搜尋 a，搜尋到 10 個符合的 document(Product.find({ ...keyword }) 找到 10 個商品，上面的 count = 10)，而我今天在商品第三頁(page = 3)，假設 pageSize = 2，我會希望我只在畫面上看到 2 個商品 (limit(2) => 限制最多只回傳 2 個 document)，
  // 而這兩個商品我希望看到 10 個符合商品裡的 '第 5 個 & 第 6 個' 商品，所以我應該跳過前 4 個商品(skip(pageSize * (page -1) = skip(4))，因此最後回傳 '第 5 個 & 第 6 個' 商品'。
  const products = await Product.find({ ...keyword }) // db.collection.find method returns a cursor 注意不能寫 await，會出錯(因為變成回傳商品 Array，之後執行 limit() 就會報錯了)
    .sort(sortProducts)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // 如果想要新加入的商品加到首頁最前面，可以在 res 之前 sort 這個 products array
  // const sortedProducts = products.sort((a, b) => new Date(b.createdAt).getTime()  - new Date(a.createdAt).getTime())
  // 參考: https://stackoverflow.com/questions/56612302/sort-array-by-date-in-javascript
  // 發現更好的方法了，用 _id 來 sort 就好了 (我目前的作法)

  if (products.length) {
    res.json({ products, page, pages: Math.ceil(count / pageSize) }); // 轉為 json 格式作為 response 送出 (pages 為總頁數)
  } else {
    // 沒找到時 product 回傳 []，所以條件句記得加上 .length，否則永遠不會丟 error 出去 (因為 [] Boolean 為 true)
    res.status(404);
    throw new Error('查無商品');
  }
});

// @描述: 獲取單一商品
// @route: GET /api/products/:id
// @使用權: Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    // 沒找到時 product 為 null
    res.status(404);
    throw new Error('查無商品');
  }
});

// @描述: DELETE a product (Admin only)
// @route: DELETE /api/products/:id   (以 id 來刪除該特定 product)
// @使用權: Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  // findOneAndRemove() 可以直接找到 product 並刪除，但我這邊選擇先 findById() 再 remove() 的原因是因為這樣我就可以在 remove() 之前再多做一些額外的檢查
  const product = await Product.findById(req.params.id); // 找到要刪除的 product

  if (product) {
    // 這邊代表管理員是彼此信任的，都有權利刪除任何商品 (如果想要限制管理員只能刪除自己的商品，可以在這邊多檢查 if (req.user._id === product.user)
    await product.remove(); // 刪除商品
    res.json({ message: '商品已刪除' });
  } else {
    res.status(404);
    throw new Error('查無此商品');
  }
});

// @描述: CREATE a product (Admin only)
// @route: POST /api/products
// @使用權: Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // 當我們按下建立新商品，會先立刻創建一個樣本商品，之後再編輯成我們要的商品
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id, // 創建者的 user id
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save(); // 存入樣本商品到 DB

  res.status(201).json(createdProduct);
});

// @描述: UPDATE a product (Admin only)
// @route: PUT /api/products/:id
// @使用權: Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('查無此商品');
  }
});

// @描述: CREATE new review
// @route: POST /api/products/:id/reviews
// @使用權: Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  // TODO: 之後考慮使用跟蝦皮類似的做法，讓只有曾經買過該商品(且商品已付費且交付完成)的用戶評論

  if (product) {
    // find() 有找到就回傳該 element，沒有回傳 undefined
    const alreadyReviewed = product.reviews.find(
      // ObjectId 不能直接做比較(物件有 ref 問題) toString() 參考: https://docs.mongodb.com/manual/reference/method/ObjectId.toString/
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('該產品已經評論過囉!');
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length; // 可以順便讓原本的假資料變成正確的評價人數

      product.rating =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.numReviews;

      await product.save();
      res.status(201).json({ message: '評論成功!' });
    }
  } else {
    res.status(404);
    throw new Error('查無此商品');
  }
});

// @描述: 取得目前評價最高的三個商品
// @route: GET /api/products/top
// @使用權: Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getAllProducts,
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}; // 注意別不小心習慣加 const XD
