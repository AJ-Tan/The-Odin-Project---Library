import {Library} from './Library.js'

async function booksAPI() {
  const searchRes = await fetch('https://openlibrary.org/people/mekBot/books/want-to-read.json');
  if(!searchRes.ok) throw new Error(`Status: ${searchRes.status} Status Text: ${searchRes.statusText}`);
  const jsonData = await searchRes.json();

  const parseData = new Map(jsonData['reading_log_entries']
    .map(({work}) => {
      const id = crypto.randomUUID();
      return [id, {
      book_id: id,
      book_title: work.title,
      book_author: work.author_names,
      cover: `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`,
      book_pages: Math.floor(Math.random() * 100) + 100,
      book_read: false
    }]
    }));
  return parseData;
}

let bookList = null;
booksAPI()
.then(res => {
  bookList = new Library(res);

  bookList.generateBookNode();
})
.catch(rej => {
  console.log(rej);
})

const modal = document.getElementById("modal__book");
const closeModal = document.getElementById("btn-close-modal");
const addBook = document.getElementById("add-book");

closeModal.addEventListener('click', () => {
  modal.close();
})

addBook.addEventListener('click', () => {
  modal.showModal();
})

const formAddBook = document.querySelector('.form__add-book');

formAddBook.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(formAddBook);
  const formEntries = Object.fromEntries(formData.entries());
  bookList.addBook(formEntries);
  modal.close();
  formAddBook.reset();
})