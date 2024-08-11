document.addEventListener('deviceready', function() {
    console.log('Device is ready');
    loadBooksFromJSON();
});

let books = [];

function addBook() {
    var book = {
        id: document.getElementById('book-id').value,
        title: document.getElementById('book-title').value,
        author: document.getElementById('author').value,
        publisher: document.getElementById('publisher').value,
        isbn: document.getElementById('isbn').value,
        year: document.getElementById('publication-year').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        coverImage: document.getElementById('cover-image').value
    };

    books.push(book);
    displayBooks();
    clearInputs();
}

function displayBooks() {
    var bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach(function(book) {
        var listItem = document.createElement('li');
        listItem.innerHTML = `
            <div>
                <img src="${book.coverImage}" alt="Cover Image" class="cover-image">
                <strong>${book.title}</strong> by ${book.author}<br>
                <em>Publisher:</em> ${book.publisher}<br>
                <em>ISBN:</em> ${book.isbn}<br>
                <em>Year:</em> ${book.year}<br>
                <em>Description:</em> ${book.description}<br>
                <em>Price:</em> $${book.price}
            </div>
        `;
        listItem.appendChild(createEditButton(book.id));
        listItem.appendChild(createDeleteButton(book.id));
        bookList.appendChild(listItem);
    });
}

function createEditButton(bookId) {
    var editButton = document.createElement('button');
    editButton.style.backgroundColor = "#1434A4";
    editButton.textContent = 'Edit';
    editButton.onclick = function() {
        var book = books.find(b => b.id === bookId);
        if (book) {
            document.getElementById('book-id').value = book.id;
            document.getElementById('book-title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('publisher').value = book.publisher;
            document.getElementById('isbn').value = book.isbn;
            document.getElementById('publication-year').value = book.year;
            document.getElementById('description').value = book.description;
            document.getElementById('price').value = book.price;
            document.getElementById('cover-image').value = book.coverImage;

            books = books.filter(b => b.id !== bookId); 
        }
    };
    return editButton;
}

function createDeleteButton(bookId) {
    var deleteButton = document.createElement('button');
    deleteButton.style.backgroundColor = "#B22222";
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        books = books.filter(b => b.id !== bookId);
        displayBooks();
    };
    return deleteButton;
}

function saveBooksToJSON() {    
    const booksJSON = JSON.stringify(books, null, 2);
    
    const fileName = "books.json";
    const directory = cordova.file.externalDataDirectory; 

    window.resolveLocalFileSystemURL(directory, 
        function (dirEntry) {
        dirEntry.getFile(fileName, { create: true, exclusive: false }, 
            function (fileEntry) {
            fileEntry.createWriter(
                function (fileWriter) {
                fileWriter.onwriteend = function () {
                    alert("Books saved to " + fileEntry.nativeURL);
                };

                fileWriter.onerror = function (e) {
                    console.error("Failed to write file: " + e.toString());
                };

                const blob = new Blob([booksJSON], { type: "application/json" });
                fileWriter.write(blob);
            }, onError); 
        }, onError); 
    }, onError); 
}

function onError(error) {
    console.error("File error: " + error.code);
}

function clearInputs() {
    document.getElementById('book-form').reset();
}
