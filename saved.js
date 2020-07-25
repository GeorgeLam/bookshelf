let foundItems = document.querySelector(".found-items");

saved = JSON.parse(localStorage.getItem('books'));
console.log(saved);

document.querySelector("#item-count").innerText = `You've saved ${saved.length} books.`

saved.forEach(book => {
    newBook = document.createElement("DIV")
    newBook.classList.add("col", "col-12", "col-lg-6", "py-2")
    newBook.innerHTML = `<div class="card h-100">
                            <div class="row card-body">
                                <div class="col-sm-8">
                                    <h5 class="card-title">${book.title}</h5>
                                    <p class="card-text">${book.author}</p>
                                    <a href="https://books.google.com/books?id=###" target="_blank" class="btn btn-sm btn-primary">Learn More</a>
                                    <a href="###" class="btn btn-sm btn-primary save-book" id="#" data-toggle="tooltip" data-placement="right"  data-trigger="manual" data-delay='{"show":"500", "hide":"300"}'>Remove Book</a>
                                </div>
                                <img class="col-sm-4" src="${book.image}" alt="Image of ${book.title}" />
                            </div>
                        </div>`
    foundItems.appendChild(newBook);
});