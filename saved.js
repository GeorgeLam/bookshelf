let foundItems = document.querySelector(".found-items");

saved = JSON.parse(localStorage.getItem('books'));
console.log(saved);

linkActivation = () => {
    $(".unsave-book").click((e) => {
        e.preventDefault();
        saved = saved.filter((item) => item.id !== `${e.target.id}`)
        console.log(saved);
        localStorage.setItem('books', JSON.stringify(saved));
        loadList();
    })
}


loadList = () => {
    foundItems.innerHTML = "";
    document.querySelector("#item-count").innerText = `You've saved ${saved.length} books.`
    
    $("#previous").hide(); $("#next").hide();


    saved.forEach(book => {
        newBook = document.createElement("DIV")
        newBook.classList.add("col", "col-12", "col-md-6", "py-2")
        newBook.innerHTML = `<div class="card h-100">
                                <div class="row card-body">
                                    <div class="col-8">
                                        <h5 class="card-title">${book.title}</h5>
                                        <p class="card-text">${book.author}</p>
                                        <a href="${book.learnLink}" target="_blank" class="btn btn-sm btn-primary">Learn More</a>
                                        <a href="#" class="btn btn-sm btn-primary unsave-book" id="${book.id}">Remove</a>
                                    </div>
                                    <img class="col-4" src="${book.image}" alt="Image of ${book.title}" />
                                </div>
                            </div>`
        foundItems.appendChild(newBook);
    })
    linkActivation();
}

loadList();

