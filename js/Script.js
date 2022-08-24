const books = [];
const RENDER_EVENT = "render-book";
document.addEventListener("DOMContentLoaded", function () {
    const submitBook = document.getElementById("inputBook");

    submitBook.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        localDataFromStorage();
    }
})

function addBook() {
    // fitur checkbox
    const checkbox = document.getElementById("inputBookIsComplete");
    if (checkbox.checked == true) {
        const titleBook = document.getElementById("inputBookTitle").value;
        const authorBook = document.getElementById("inputBookAuthor").value;
        const yearBook = document.getElementById("inputBookYear").value;
        const bookYear = parseInt(yearBook)

        const generatedID = generateId()
        const bookObject = generateBookObject(generatedID, titleBook, authorBook, bookYear, true);
        books.push(bookObject);
        Swal.fire(
            'Berhasil Menambah Buku!',
            'Buku Sudah Di Tambahkan  Di Sudah Terbaca!',
            'success'
        )
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    } else {
        const titleBook = document.getElementById("inputBookTitle").value;
        const authorBook = document.getElementById("inputBookAuthor").value;
        const yearBook = document.getElementById("inputBookYear").value;
        const bookYear = parseInt(yearBook)

        const generatedID = generateId(); 
        const bookObject = generateBookObject(generatedID, titleBook, authorBook, bookYear, false);
        books.push(bookObject);
        Swal.fire(
            'Berhasil Menambah Buku!',
            'Buku Sudah Di Tambahkan  Di Belum Terbaca!',
            'success'
        )
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

function generateId() {
    return +new Date;
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    }
}

document.addEventListener(RENDER_EVENT, function () {
    // console.log(books);
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeBookshelfList")
    completedBookList.innerHTML = "";

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted == false) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
})

// 

function makeBook(bookObject) {

    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = bookObject.author;

    const textYears = document.createElement("p");
    textYears.innerText = bookObject.year;


    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textTitle, textAuthor, textYears)
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const content = document.createElement("div");
        content.classList.add("action");
        const buttonuncompleted = document.createElement("button");
        buttonuncompleted.classList.add("green");
        buttonuncompleted.innerText = "Belum Selesai di baca";
        buttonuncompleted.addEventListener("click", function () {
            addBooksToUncompleted(bookObject.id);
        });
        const buttondelete = document.createElement("button");
        buttondelete.classList.add("red")
        buttondelete.innerText = "Hapus Buku";
        buttondelete.addEventListener("click", function () {
            addBooksToDelete(bookObject.id);
        });
        container.append(content);
        content.append(buttonuncompleted, buttondelete);
    } else {
        const content = document.createElement("div");
        content.classList.add("action");
        const buttoncompleted = document.createElement("button");
        buttoncompleted.classList.add("green");
        buttoncompleted.innerText = "Selesai dibaca";
        buttoncompleted.addEventListener("click", function () {
            addBooksToCompleted(bookObject.id);
        });
        const buttondelete = document.createElement("button");
        buttondelete.classList.add("red")
        buttondelete.innerText = "Hapus Buku";
        buttondelete.addEventListener("click", function () {
            addBooksToDelete(bookObject.id);
        });
        container.append(content);
        content.append(buttoncompleted, buttondelete);
    }
    return container;
}

function addBooksToCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBooksToUncompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBooksToDelete(bookId) {
    Swal.fire({
        title: 'Apakah Yakin Ingin Menghapus?',
        text: "jika ingin menghapus klik hapus dan jika tidak kilik cancel",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Hapus'
    }).then((result) => {
        if (result.isConfirmed) {
            const bookTarget = findBookIndex(bookId);
            if (bookTarget === -1) return;
            books.splice(bookTarget, 1);
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        } else {
            document.dispatchEvent(new Event(RENDER_EVENT));
        }
    })
}

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}