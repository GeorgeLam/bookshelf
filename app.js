// const { create } = require("domain");

console.log("Loaded")

let foundItems = document.querySelector(".found-items");

async function searcher(query){
    url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

    response = await fetch(url);
    console.log(response);
    let data = await response.json();
    console.log(data);
    data.items.forEach(book => {
        console.log(book.volumeInfo.authors)
        console.log(book.volumeInfo.title)
        console.log(`${book.volumeInfo.title} was published in ${book.volumeInfo.publishedDate} by ${book.volumeInfo.publisher}. The book, written by ${book.volumeInfo.authors} has ${book.volumeInfo.pageCount} pages. It is considered to be a ${book.volumeInfo.categories} book.`)
    })

    foundItems.innerHTML = "";

    data.items.forEach(book =>{
        newBook = document.createElement("DIV")
        newBook.classList.add("col", "col-12", "col-lg-6", "py-2")
        newBook.innerHTML = `<div class="card h-100">
                        <div class="row card-body">
                            <div class="col-sm-8">
                                <h5 class="card-title">${book.volumeInfo.title}</h5>
                                <p class="card-text">${book.volumeInfo.authors}</p>
                                <p class="card-text">${book.volumeInfo.title} was published in ${book.volumeInfo.publishedDate} by ${book.volumeInfo.publisher}. The book, written by ${book.volumeInfo.authors} has ${book.volumeInfo.pageCount} pages. It is considered to be a ${book.volumeInfo.categories} book.</p>
                                <a href="#" class="btn btn-sm btn-primary">Learn More</a>
                                <a href="#" class="btn btn-sm btn-primary">Save</a>
                            </div>
                            <img class="col-sm-4" src="${book.volumeInfo.imageLinks.smallThumbnail}" alt="sans" />
                        </div>
                    </div>`
        foundItems.appendChild(newBook);
        console.log("added!")
    })
}

document.querySelector("#search").addEventListener("click", () => {
    searcher(document.querySelector("#query").value)
});

let exampleBook = {
    "authors": "F. Scott Fitzgerald",
    "title": "The Great Gatsby",
    "publishedDate": "1930",
    "pageCount": "165",
    "publisher": "NY Publishing",
    "categories": "Fiction"    
}



// let bookCard = `<div class="col col-12 col-lg-6 py-2">
//                     <div class="card">
//                         <div class="row card-body">
//                             <div class="col-sm-9">
//                                 <h5 class="card-title">${exampleBook.title}</h5>
//                                 <p class="card-text">${exampleBook.authors}</p>
//                                 <p class="card-text">fjdokmasodcasdiojc</p>
//                                 <a href="#" class="btn btn-sm btn-primary">Learn More</a>
//                                 <a href="#" class="btn btn-sm btn-primary">Save</a>
//                             </div>
//                             <img class="col-sm-3" src="Images/template.png" alt="sans" />
//                         </div>
//                     </div>
//                 </div>`

//let foundItems = document.querySelector(".found-items");
// newBook = document.createElement("DIV")
// newBook.classList.add("col", "col-12", "col-lg-6", "py-2")
// newBook.innerHTML = `<div class="card">
//                         <div class="row card-body">
//                             <div class="col-sm-9">
//                                 <h5 class="card-title">${exampleBook.title}</h5>
//                                 <p class="card-text">${exampleBook.authors}</p>
//                                 <p class="card-text">fjdokmasodcasdiojc</p>
//                                 <a href="#" class="btn btn-sm btn-primary">Learn More</a>
//                                 <a href="#" class="btn btn-sm btn-primary">Save</a>
//                             </div>
//                             <img class="col-sm-3" src="Images/template.png" alt="sans" />
//                         </div>
//                     </div>`
// foundItems.appendChild(newBook);
// console.log("added!")