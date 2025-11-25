async function booksAPI() {
  const searchRes = await fetch('https://openlibrary.org/people/mekBot/books/want-to-read.json');
  if(!searchRes.ok) throw new Error(`Status: ${searchRes.status} Status Text: ${searchRes.statusText}`);
  const jsonData = await searchRes.json();

  const parseData = jsonData['reading_log_entries']
    .map(({work}) => ({
      book_title: work.title,
      book_author: work.author_names,
      cover_id: work.cover_id,
      book_pages: Math.floor(Math.random() * 100) + 100,
      book_read: false
    }));

    // for cover image https://covers.openlibrary.org/b/id/[cover_id]-M.jpg

  return parseData;
}

const Books = function(bookList) {
  this.bookList = bookList;
}

Books.prototype = {
  getBookList() {
    return this.bookList;
  }
}

function booksNode(cover_id, book_title = '', book_author = '', book_pages = 0, book_read = false) {
  if(cover_id == null) return;
  const bookListNode = document.querySelector('.book-list');
  const bookItemNode = document.createElement('li');
  bookItemNode.classList.add('book-item');

  const bookCoverNode = document.createElement('img');
  bookCoverNode.classList.add('book-cover');
  bookCoverNode.setAttribute('src',`https://covers.openlibrary.org/b/id/${cover_id}-M.jpg`);
  bookItemNode.appendChild(bookCoverNode);

  const bookDetailsNode = document.createElement('div');
  bookDetailsNode.classList.add('book-details');

  const bookTitleNode = document.createElement('h2');
  bookTitleNode.textContent = book_title;
  bookTitleNode.classList.add('book-title');
  bookDetailsNode.appendChild(bookTitleNode);
  
  const bookAuthorNode = document.createElement('span');
  bookAuthorNode.textContent = book_author;
  bookAuthorNode.classList.add('book-author');
  bookDetailsNode.appendChild(bookAuthorNode);

  const bookPagesNode = document.createElement('span');
  bookPagesNode.textContent = `${book_pages} pages`;
  bookPagesNode.classList.add('book-pages');
  bookDetailsNode.appendChild(bookPagesNode);

  bookItemNode.appendChild(bookDetailsNode);

  const bookReadNode = document.createElement('button');
  bookReadNode.textContent = 'Mark read';
  bookReadNode.classList.add('btn-book-read');
  bookReadNode.setAttribute('type', 'button');
  bookReadNode.setAttribute('data-isRead', 'false');
  bookItemNode.appendChild(bookReadNode);

  bookListNode.appendChild(bookItemNode);
}


booksAPI()
.then(res => {
  const initialBooklist = new Books(res);

  console.log(res);
  res.forEach(({book_title, book_author, cover_id, book_pages, book_read}) => {
    booksNode(cover_id,book_title,book_author, book_pages, book_read)
  });
})
.catch(rej => {
  console.log(rej);
})