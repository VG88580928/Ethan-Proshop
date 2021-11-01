import bcrypt from 'bcryptjs';

// 此處的資料必須符合 userSchema 內的資料，否則 mongoose 會阻擋我們 insert 資料進 DB
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10), // 這裡用同步語法就好，真正註冊時使用非同步語法 而第二參數 10 代表 hash 字符數(越大越安全)
    isAdmin: true,
  },
  {
    name: 'Ethan Wu',
    email: 'Ethan@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: '倫倫',
    email: 'lun@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
