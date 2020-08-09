let foundItems = document.querySelector(".found-items");

savedBooks = JSON.parse(localStorage.getItem('books'));
console.log(savedBooks);

linkActivation = () => {
    console.log("activation started");

    $(".unsave-book").click((e) => {
        e.preventDefault();
        savedBooks = savedBooks.filter((item) => item.id !== `${e.target.id}`)
        console.log(savedBooks);
        localStorage.setItem('books', JSON.stringify(savedBooks));
        
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                db.collection("users").doc(`${user.displayName}`).set({
                    books: JSON.stringify(savedBooks)
                })
            }
        })

        loadList();
    })

    let currentlyEditingBook, reviewBox, ratingBox;
    $(".edit-book").click((e) => {
        currentlyEditingBook = "";
        currentlyEditingBook = e.target.id;
        currentlyEditingBook = currentlyEditingBook.slice(4)
        currentEdit = e.target.parentElement.id.slice(2)

        savedBooks.forEach(book => {
            if (book.id == currentlyEditingBook) {
                console.log("Found the book: " + book.id);
                console.log(book.review);
                reviewBox = book.review;
                ratingBox = book.rating;
                console.log(reviewBox, ratingBox);
            }
        })
        //when editing box is opened, review/rating inputs are set to their current values
        $("#bookRating").val(ratingBox);        
        $("#bookReview").val(reviewBox);
    })

    $(".saveRating").click((e) => {
        rating = $("#bookRating").val();
        review = $("#bookReview").val();

        ratingText = rating ? `You rated this book ${rating}/5.` : `You haven't rated this book yet.`
        reviewText = review ? review : `You haven't reviewed this book yet.`

        $(`#rating${currentEdit}`).html(ratingText);
        $(`#review${currentEdit}`).html(reviewText);

        //Saving the review/rating input into the book for which the edit btn was clicked
        savedBooks.forEach(book => {
            if (book.id == currentlyEditingBook){
                console.log("Found the book: " +book.id);
                book.review = review;
                book.rating = rating;
                console.log(savedBooks);
                //Storing the updated savedBooks item on the database
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        db.collection("users").doc(`${user.displayName}`).set({
                            books: JSON.stringify(savedBooks)
                        })
                    }
                })                  
            }
        })
        localStorage.setItem('books', JSON.stringify(savedBooks));  //saving to localStorage
    })
}


loadList = () => {
    console.log("LL started");
    foundItems.innerHTML = "";
    document.querySelector("#item-count").innerText = `You've saved ${savedBooks.length} books.`
    
    $("#previous").hide(); $("#next").hide();

    let counter = 0;

    savedBooks.forEach(book => {
        ++counter;
        //console.log(counter);
        //console.log(book.rating);
        newBook = document.createElement("DIV")
        newBook.classList.add("col", "col-12", "col-md-6", "py-2")
        ratingText = book.rating ? `You rated this book ${book.rating}/5.` : `You haven't rated this book yet.`
        reviewText = book.review ? book.review : `You haven't reviewed this book yet.`
        newBook.innerHTML = `<div class="card h-100">
                                <div class="row card-body">
                                    <div class="col-8" id="bk${counter}">
                                        <h5 class="card-title">${book.title}</h5>
                                        <p class="card-text">${book.author}</p>
                                        <p class="rating" id="rating${counter}">${ratingText}</p>
                                        <p class="review" id="review${counter}"><strong>Your review:</strong><br/>${reviewText}</p>
                                        <a href="${book.learnLink}" target="_blank" class="btn btn-sm btn-primary">Learn More</a>
                                        <a href="#" class="btn btn-sm btn-primary edit-book" id="edit${book.id}" data-toggle="modal" data-target="#ratingModal">Edit</a>
                                        <a href="#" class="btn btn-sm btn-primary unsave-book" id="${book.id}">Remove</a>
                                    </div>
                                    <img class="col-4" src="${book.image}" alt="Image of ${book.title}" />
                                </div>
                            </div>`
        foundItems.appendChild(newBook);
    })
    linkActivation();
}

authCheck = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user);
        if (user) {
            console.log(firebase.auth().currentUser)

            var docRef = db.collection("users").doc(`${user.displayName}`);
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    let retrievedBooks = JSON.parse(doc.data().books);
                    console.log(retrievedBooks);
                    savedBooks = [];
                    retrievedBooks.forEach(book => {
                        savedBooks.push(book)
                    })
                    console.log(savedBooks);
                    if (savedBooks) {
                        console.log("authCheckloop")
                        localStorage.setItem(`books`, JSON.stringify(savedBooks));
                    }
                    loadList(); //Calling the function that loads the list on the page
                    //linkActivation();

                } else {
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });

            console.log("DB has been updated")
    
            // User is signed in.
            $("#acc-status").html(`You're logged in as <strong>${user.displayName}</strong>`);
            $('#exampleModal').modal('hide');
            $("#my-acc").attr('data-target', '')
            $("#my-acc").text("Log out");
            $("#my-acc").click(handleLogOut);
        } else {
            // User is not signed in.
            $("#acc-status").text(`You're not logged in`);
            console.log("Not logged in")
        }
    });
};

$("#my-acc").click(() => {
    handleLogOut;
    window.location.href = "./index.html";
    });

function handleLogOut() {
    firebase.auth().signOut().then(function () {
        console.log("Signed Out")// Sign-out successful.
        $("#my-acc").text("Log In");
        $("#my-acc").attr('data-target', '#exampleModal')

        localStorage.setItem(`books`, "[]");
        console.log("rewriting LS bc hLO func")

    }).catch(function (error) {
        console.log(error)
        // An error happened.
    });
}

window.onload = function () {
    authCheck();
};