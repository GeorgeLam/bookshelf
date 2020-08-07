let foundItems = document.querySelector(".found-items");

savedBooks = JSON.parse(localStorage.getItem('books'));
console.log(savedBooks);

linkActivation = () => {
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

    let currentlyEditingBook;
    $(".edit-book").click((e) => {
        currentlyEditingBook = "";
        currentlyEditingBook = e.target.id;
        currentlyEditingBook = currentlyEditingBook.slice(4)
        console.log(currentlyEditingBook);
        $("#bookRating").val("");
        $("#bookReview").val("");
    })

    $(".saveRating").click((e) => {
        e.preventDefault();
        console.log("saving rating");
        editingBook = "";
        rating = ""; review = "";
        console.log($("#bookRating").val())
        console.log($("#bookReview").val())
        rating = $("#bookRating").val();
        review = $("#bookReview").val();


        for(let i = 0; i < savedBooks.length; i++){
            console.log(savedBooks[i].id);
            if (savedBooks[i].id == currentlyEditingBook){
                console.log("Found the book: " + savedBooks[i].id);
                savedBooks[i].review = review;
                savedBooks[i].rating = rating;
                console.log(savedBooks);
            }
        }

        // editingBook = savedBooks.filter((item) => item.id == currentlyEditingBook);
        // savedBooks = savedBooks.filter((item) => item.id !== currentlyEditingBook);
        // console.log(savedBooks);
        // console.log(editingBook);
        // editingBook[0].review = $("#bookReview").val();
        // editingBook[0].rating = $("#bookRating").val();
        // savedBooks.push(editingBook);



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
}


loadList = () => {
    foundItems.innerHTML = "";
    document.querySelector("#item-count").innerText = `You've saved ${savedBooks.length} books.`
    
    $("#previous").hide(); $("#next").hide();


    savedBooks.forEach(book => {
        console.log(book.rating);
        newBook = document.createElement("DIV")
        newBook.classList.add("col", "col-12", "col-md-6", "py-2")
        ratingText = book.rating ? `You rated this book ${book.rating}/5.` : `You haven't rated this book yet.`
        reviewText = book.review ? book.review : `You haven't reviewed this book yet.`
        newBook.innerHTML = `<div class="card h-100">
                                <div class="row card-body">
                                    <div class="col-8">
                                        <h5 class="card-title">${book.title}</h5>
                                        <p class="card-text">${book.author}</p>
                                        <p class="rating">${ratingText}</p>
                                        <p class="review"><strong>Your review:</strong><br/>${reviewText}</p>
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

//loadList();

authCheck = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user);
        //  console.log(user.displayName);
        //user.displayName = "octopus33n";
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
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });

            //console.log(retrievedBooks);

            // db.collection("users").doc(`${user.displayName}`).set({
            //     //username: user.displayName,
            //     //email: user.email,
            //     books: JSON.stringify(savedBooks)
            // }, { merge: true })
            console.log("DB change")
            //localStorage.setItem(`books`, "[]");
            //localStorage.setItem(`books`, JSON.stringify(savedBooks));



            // User is signed in.
            logInStatus = 1;

            $("#acc-status").html(`You're logged in as <strong>${user.displayName}</strong>`);
            $('#exampleModal').modal('hide');
            $("#my-acc").attr('data-target', '')
            $("#my-acc").text("Log out");
            $("#my-acc").click(handleLogOut);
        } else {
            $("#acc-status").text(`You're not logged in`);
            console.log("Not logged in")
            logInStatus = 0;
            // User is signed out.
            // ...
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