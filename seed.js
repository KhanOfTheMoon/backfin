const mongoose = require('mongoose');
const Book = require('./models/Book');
const dotenv = require('dotenv');
dotenv.config();

// Your original data
const DB = [
  {title:'Harry Potter and the Philosopher’s Stone', author:'J. K. Rowling', genre:'Fantasy',  year:1997, rating:4.8, reviewsCount:4980, price:5990,  cover:'https://api.azbooka.ru/upload/iblock/49c/49c77b6fe936e413535a054e859b3575.jpg'},
  {title:'Harry Potter and the Chamber of Secrets',  author:'J. K. Rowling', genre:'Fantasy',  year:1998, rating:4.7, reviewsCount:4720, price:6190,  cover:'https://api.azbooka.ru/upload/iblock/575/575360ce833b06c9d3065bdcb1501175.jpg'},
  {title:'Harry Potter and the Prisoner of Azkaban', author:'J. K. Rowling', genre:'Fantasy',  year:1999, rating:4.8, reviewsCount:4890, price:6390,  cover:'https://img.votonia.ru/products/59a0252b1b1eb.jpg'},
  {title:'Harry Potter and the Goblet of Fire',       author:'J. K. Rowling', genre:'Fantasy',  year:2000, rating:4.7, reviewsCount:4650, price:6690,  cover:'https://cdn1.ozone.ru/s3/multimedia-z/6511186211.jpg'},
  {title:'Harry Potter and the Order of the Phoenix', author:'J. K. Rowling', genre:'Fantasy',  year:2003, rating:4.6, reviewsCount:4510, price:5790,  cover:'https://api.azbooka.ru/upload/iblock/22e/22ee9fcbd47fa5cb580c4c2e2715daf4.jpg'},
  {title:'Harry Potter and the Half-Blood Prince',    author:'J. K. Rowling', genre:'Fantasy',  year:2005, rating:4.7, reviewsCount:4330, price:6890,  cover:'https://api.azbooka.ru/upload/iblock/343/343b392f7612583421fae4a83074b59f.jpg'},
  {title:'Harry Potter and the Deathly Hallows',      author:'J. K. Rowling', genre:'Fantasy',  year:2007, rating:4.9, reviewsCount:5000, price:5590,  cover:'https://api.azbooka.ru/upload/iblock/8cd/8cdd05b5e1c78163608dcba0f55ca34e.jpg'},
  {title:'Ten Little Niggers',                  author:'A. Christie',   genre:'Detective',year:1939, rating:4.5, reviewsCount:3980, price:4990,  cover:'https://avatars.mds.yandex.net/i?id=1baacd15c1aeefd726a7f67a1673afdf_l-9106775-images-thumbs&n=13'},
  {title:'Murder on the Orient Express',              author:'A. Christie',   genre:'Detective',year:1934, rating:4.3, reviewsCount:3120, price:4690,  cover:'https://basket-19.wbbasket.ru/vol3245/part324516/324516752/images/big/1.webp'},
  {title:'Pet Sematary',                              author:'S. King',       genre:'Horror',   year:1983, rating:4.1, reviewsCount:3190, price:5790,  cover:'https://avatars.mds.yandex.net/get-mpic/5210379/2a000001920bee36380cf670e8825f48f8cc/orig'},
  {title:'It',                                       author:'S. King',       genre:'Horror',   year:1986, rating:4.2, reviewsCount:3350, price:6990,  cover:'https://avatars.mds.yandex.net/i?id=c9b8ca506d68970183b8e05e504d5c024feedfa04f61f332-11018127-images-thumbs&n=13'},
  {title:'The Shining',                               author:'S. King',       genre:'Horror',   year:1977, rating:4.4, reviewsCount:3520, price:6290,  cover:'https://avatars.mds.yandex.net/i?id=43e2e2aa24e99469f8b51aae353b22540475a537-5888323-images-thumbs&n=13'},
  {title:'The Green Mile',                            author:'S. King',       genre:'Drama',    year:1996, rating:4.6, reviewsCount:3710, price:5890,  cover:'https://avatars.mds.yandex.net/i?id=035ab8645b2ad78613c940f73ceb99fe_l-5231672-images-thumbs&n=13'},
  {title:'Fahrenheit 451',                            author:'R. Bradbury',   genre:'Sci-Fi',   year:1953, rating:4.4, reviewsCount:4180, price:5490,  cover:'https://goods-photos.static1-sima-land.com/items/6224016/0/1600.jpg?v=1630067706'},
  {title:'The Murder of Roger Ackroyd',                 author:'A. Christie',   genre:'Detective',year:1926, rating:4.2, reviewsCount:2880, price:5190,  cover:'https://avatars.mds.yandex.net/get-mpic/15060735/2a000001971a79d739d855a2f6e72731ddb7/orig'}
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Book.deleteMany({});
  await Book.insertMany(DB);
  console.log('Database Seeded!');
  process.exit();
}).catch(err => {
  console.log(err);
  process.exit(1);
});