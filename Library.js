export const Library = function(bookList) {
  this.bookList = bookList;
}

Library.prototype = {
  getBookList() {
    return this.bookList;
  },

  addBook({inputTitle, inputAuthor, inputPages, inputCover, inputRead}) {
    const id = crypto.randomUUID();
    this.bookList.set(id, {
      book_id: id,
      book_title: inputTitle,
      book_author: inputAuthor,
      cover: inputCover,
      book_pages: inputPages,
      book_read: inputRead === 'true'
    });
    
    this.generateBookNode();
  },

  deleteBook(book_id) {
    this.bookList.delete(book_id);

    this.generateBookNode();
  },

  toggleRead(book_id) {
    const book = this.bookList.get(book_id);
    if(book) {
      book.book_read = !book.book_read;
      return book.book_read;
    }
    return undefined;
  },

  generateBookNode() {
    const bookListNode = document.querySelector('.book-list');
    bookListNode.replaceChildren();
    this.bookList.forEach(bookData => {
      this.booksNode(bookData)
    });
  },
  
  booksNode({book_id, book_title, book_author, cover, book_pages, book_read}) {
    const bookListNode = document.querySelector('.book-list');
    const bookItemNode = document.createElement('li');

    bookItemNode.setAttribute('data-id', book_id)
    bookItemNode.classList.add('book-item');

    const bookCoverNode = document.createElement('img');
    bookCoverNode.classList.add('book-cover');
    bookCoverNode.setAttribute('src',cover);
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

    const bookActionsNode = document.createElement('div');
    bookActionsNode.classList.add('book-actions')

    const bookReadNode = document.createElement('button');
    bookReadNode.textContent = 'Mark read';
    bookReadNode.classList.add('btn', 'btn_read');
    bookReadNode.setAttribute('type', 'button');
    bookReadNode.setAttribute('data-isRead', book_read);
    bookReadNode.addEventListener('click', (e) => {
      const isRead = this.toggleRead(book_id);
      bookReadNode.setAttribute('data-isRead', isRead);
      bookReadNode.textContent = isRead ? 'Mark unread' : 'Mark read';
    })
    bookActionsNode.appendChild(bookReadNode);

    const bookDeleteNode = document.createElement('button');
    bookDeleteNode.textContent = 'Delete';
    bookDeleteNode.classList.add('btn', 'btn_delete');
    bookDeleteNode.setAttribute('type', 'button');
    bookDeleteNode.addEventListener('click', () => {
      this.deleteBook(book_id);
    })
    bookActionsNode.appendChild(bookDeleteNode);

    bookItemNode.appendChild(bookActionsNode);

    bookListNode.appendChild(bookItemNode);
  }
}