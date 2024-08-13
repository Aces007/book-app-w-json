document.addEventListener('deviceready', function() {
    console.log('Device is ready');
});

let books = [];
let currentIndex = 0;

function addBook() {
    const id = document.getElementById('book-id').value
    const title = document.getElementById('book-title').value
    const author = document.getElementById('author').value
    const publisher = document.getElementById('publisher').value
    const isbn = document.getElementById('isbn').value
    const year = document.getElementById('publication-year').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const coverImage = document.getElementById('cover-image').value



    if (id && title && author) {
        books.push({id, title, author, publisher, isbn, year, description, price, coverImage});
        displayBooks();
        document.getElementById('book-id').value = '';
        document.getElementById('book-title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('publisher').value = '';
        document.getElementById('isbn').value = '';
        document.getElementById('publication-year').value = '';
        document.getElementById('description').value = '';
        document.getElementById('price').value = '';
        document.getElementById('cover-image').value = '';
    } else{
        alert("Enter all necessary book details");
    }
}

function displayBooks() {
    if (books.length === 0) {
        document.getElementById('book-list').innerHTML = '<p>No Books Available.</p>';
        return;
    }

    const book = books[currentIndex];

    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    const listItem = document.createElement('li');

    listItem.innerHTML = `
        <div>
            <img src="${book.coverImage}" alt="Cover Image" class="cover-image">
            <strong>${book.title}</strong> by ${book.author}<br>
            <em>Publisher:</em> ${book.publisher}<br>
            <em>ISBN:</em> ${book.isbn}<br>
            <em>Year:</em> ${book.year}<br>
            <em>Description:</em> ${book.description}<br>
            <em>Price:</em> PHP${book.price}
        </div>
    `;

    const navBtns = document.createElement('div');
    navBtns.className = 'navBtns';
    navBtns.style.marginTop = "10px";


    const prevBtn = document.createElement('button');
    prevBtn.id = 'prevBtn';
    prevBtn.textContent = '<';
    prevBtn.onclick = function() {
        if (currentIndex > 0) {
            currentIndex--;
            displayBooks();
        }
    }; prevBtn.disabled = currentIndex === 0;

    const nextBtn = document.createElement('button');
    nextBtn.id = 'nextBtn';
    nextBtn.textContent = '>';
    nextBtn.onclick = function() {
        if (currentIndex < books.length - 1) {
            currentIndex++;
            displayBooks();
        }
    }; nextBtn.disabled = currentIndex === books.length - 1;


    navBtns.append(prevBtn)
    navBtns.append(nextBtn)

    listItem.append(createEditButton(book.id));
    listItem.append(createDeleteButton(book.id));
    listItem.append(navBtns);

    bookList.appendChild(listItem);
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

function loadBooksFromJSON() {
    const fileName = "books.json";
    const directory = cordova.file.externalDataDirectory;

    window.resolveLocalFileSystemURL(directory + fileName, function(fileEntry) {
        fileEntry.file(function(file) {
            const reader = new FileReader();

            reader.onloadend = function() {
                try {
                    books = JSON.parse(this.result) || [];
                    console.log('Books loaded:', books);
                    displayBooks();
                } catch (e) {
                    alert('Failed to parse JSON: ' + e.message);
                }
            };

            reader.onerror = function(e) {
                alert('Failed to read file: ' + e.toString());
            };

            reader.readAsText(file);
        }, onError);
    }, function(error) {
        console.log("No books file found, starting with an empty list.");
        books = [];
        displayBooks();
    });
}

function onError(error) {
    console.error("File error: " + error.code);
}

