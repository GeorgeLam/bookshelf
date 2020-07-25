let foundItems = document.querySelector(".found-items");
let index = 0;
let type;
let savedBooks = JSON.parse(localStorage.getItem('books'));
console.log(savedBooks);
let bookSet = new Set(savedBooks);
console.log(bookSet)

$(function () {
    $(document).on('shown.bs.tooltip', function (e) {
        setTimeout(function () {
            $(e.target).tooltip('hide');
        }, 750);
    });
});

$("#previous").hide(); $("#next").hide();

//Adding functionality to search, prev, fwd buttons
document.querySelector("#search-book").addEventListener("click", () => {
    type = "book";
    index = 0;
    searcher(document.querySelector("#query").value, index, type)
});
document.querySelector("#search-author").addEventListener("click", () => {
    type = "author";
    index = 0;
    searcher(document.querySelector("#query").value, index, type)
});

document.querySelector("#previous").addEventListener("click", () => {
    searcher(document.querySelector("#query").value, index-=10, type)
    $(document).on('click', '#previous', function (event) {             //Smooth scrolling
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 300);
    });
});

document.querySelector("#next").addEventListener("click", () => {
    searcher(document.querySelector("#query").value, index+=10, type)
    $(document).on('click', '#next', function (event) {                 //Smooth scrolling
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

    foundItems.innerHTML = "";      //Clearing the page of items before each time func is run
    
    bookNumber = -1;

    data.items.forEach(book =>{
        console.log(bookNumber);
        try{
            bookNumber++;

            if(book.volumeInfo.authors.length>1){
                book.volumeInfo.authors = book.volumeInfo.authors.join(" and ");
            }
            if(book.volumeInfo.publishedDate.length>4){
                book.volumeInfo.publishedDate = book.volumeInfo.publishedDate.toString().slice(0, 4)
            }
            if (book.volumeInfo.description.length > 300) {
                book.volumeInfo.description = book.volumeInfo.description.slice(0, 300) + "...";
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
                                    <a href="#" class="btn btn-sm btn-primary save-book" id="${bookNumber}" data-toggle="tooltip" data-placement="right"  data-trigger="manual" data-delay='{"show":"500", "hide":"300"}'>Save</a>
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
        duplicate = 0;
        e.preventDefault();
        //console.log(data.items[e.target.id].volumeInfo);
        //console.log(JSON.parse(savedBooks));

        newBook = {
            "title": data.items[e.target.id].volumeInfo.title,
            "author": data.items[e.target.id].volumeInfo.authors,
            "date": data.items[e.target.id].volumeInfo.publishedDate,
            "image": data.items[e.target.id].volumeInfo.imageLinks.smallThumbnail
        };

        savedBooks.forEach(book => {
        if(_.isEqual(book, newBook)){
            console.log("Duplicate found");
            duplicate = 1;}
        });

        $(function () {                             //Showing tooltips on 'save' click
            //console.log($(`#${e.target.id}`).tooltip())
            if (duplicate){
                console.log(duplicate);
                $(`#${e.target.id}`).tooltip({ "title": "Already saved!" })
            } else{
                $(`#${e.target.id}`).tooltip({ "title": "Saved mate!" })
            }
            $(`#${e.target.id}`).tooltip('show')
            $(`#${e.target.id}`).tooltip({ "title": "Already saved!" })
        })

        $(`#${e.target.id}`).addClass("saved");


        if (!duplicate){savedBooks.push(newBook)};

        // bookSet.add({
        //     "title": data.items[e.target.id].volumeInfo.title,
        //     "author": data.items[e.target.id].volumeInfo.authors,
        //     "date": data.items[e.target.id].volumeInfo.publishedDate,
        //     "image": data.items[e.target.id].volumeInfo.imageLinks.smallThumbnail
        // });
        localStorage.setItem('books', JSON.stringify(savedBooks));
        console.log(savedBooks);
        console.log(bookSet);
    });

}


//<p class="card-text">${book.volumeInfo.title} was published in ${book.volumeInfo.publishedDate} by ${book.volumeInfo.publisher}. The book, written by ${book.volumeInfo.authors}, has ${book.volumeInfo.pageCount} pages. It is considered to be a ${book.volumeInfo.categories} book.</p>