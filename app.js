// const { create } = require("domain");

console.log("Loaded")

let foundItems = document.querySelector(".found-items");
let index = 0;
let type;
let savedBooks = [];

$("#previous").hide();
$("#next").hide();

document.querySelector("#search-book").addEventListener("click", () => {
    type = "book";
    console.log(type)
    searcher(document.querySelector("#query").value, index, type)
});

document.querySelector("#search-author").addEventListener("click", () => {
    type = "author";
    searcher(document.querySelector("#query").value, index, type)
});


document.querySelector("#previous").addEventListener("click", () => {
    searcher(document.querySelector("#query").value, index-=10, type)
    $(document).on('click', '#previous', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 300);
    });
});

document.querySelector("#next").addEventListener("click", () => {
    searcher(document.querySelector("#query").value, index+=10, type)
    $(document).on('click', '#next', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 300);
    });
});


async function searcher(query, startIndex, type){
    console.log(type);
    if (type == "book"){
        url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}`;
    } else if (type == "author"){
        url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${query}&startIndex=${startIndex}`;
    }
    response = await fetch(url);
    let data = await response.json();
    console.log(data);

    document.querySelector("#item-count").innerText = `Viewing ${startIndex+1} - ${startIndex+11} of ${data.totalItems} items.`

    foundItems.innerHTML = "";

    data.items.forEach(book =>{
        try{
            if(book.volumeInfo.authors.length>1){
                book.volumeInfo.authors = book.volumeInfo.authors.join(" and ");
            }
            if(book.volumeInfo.publishedDate.length>4){
                book.volumeInfo.publishedDate = book.volumeInfo.publishedDate.toString().slice(0, 4)
            }
            if (book.volumeInfo.description.length > 300) {
                book.volumeInfo.description = book.volumeInfo.description.slice(0, 300) + "...";
                console.log(book.volumeInfo.description.length)
                // book.volumeInfo.publishedDate = book.volumeInfo.publishedDate.toString().slice(0, 4)
            }
            

            newBook = document.createElement("DIV")
            newBook.classList.add("col", "col-12", "col-lg-6", "py-2")
            newBook.innerHTML = `<div class="card h-100">
                            <div class="row card-body">
                                <div class="col-sm-8">
                                    <h5 class="card-title">${book.volumeInfo.title}</h5>
                                    <p class="card-text">${book.volumeInfo.authors}</p>
                                    <p class="card-text">${book.volumeInfo.description}</p>
                                    <a href="https://books.google.com/books?id=${book.id}" target="_blank" class="btn btn-sm btn-primary">Learn More</a>
                                    <a href="#" class="btn btn-sm btn-primary save-book" id="${book.volumeInfo.industryIdentifiers[1].identifier}">Save</a>
                                </div>
                                <img class="col-sm-4" src="${book.volumeInfo.imageLinks.smallThumbnail}" alt="sans" />
                            </div>
                        </div>`
            foundItems.appendChild(newBook);

            if (!startIndex == 0) {$("#previous").show()} else { $("#previous").hide()};
            $("#next").show();

        } catch(e){
            console.log(e)
        }

       
    })

    $(".save-book").click((e) => {
        e.preventDefault();
        console.log(e.target.id);
        savedBooks.push(e.target.id);
        console.log(savedBooks);
    });
}


//<p class="card-text">${book.volumeInfo.title} was published in ${book.volumeInfo.publishedDate} by ${book.volumeInfo.publisher}. The book, written by ${book.volumeInfo.authors}, has ${book.volumeInfo.pageCount} pages. It is considered to be a ${book.volumeInfo.categories} book.</p>