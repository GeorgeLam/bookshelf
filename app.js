let foundItems = document.querySelector(".found-items");
let index = 0;
let type;
if (localStorage.getItem('books') == ""){localStorage.setItem('books', "[]")};
let savedBooks = JSON.parse(localStorage.getItem('books')) || [];
console.log(savedBooks);

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
            newBook.classList.add("col", "col-12", "col-md-6", "py-2")
            newBook.innerHTML = `<div class="card h-100">
                            <div class="row card-body">
                                <div class="col-8">
                                    <h5 class="card-title">${book.volumeInfo.title}</h5>
                                    <p class="card-text">${book.volumeInfo.authors}</p>
                                    <p class="card-text">${book.volumeInfo.description}</p>
                                    <a href="https://books.google.com/books?id=${book.id}" target="_blank" class="btn btn-sm btn-primary">Learn More</a>
                                    <a href="#" class="btn btn-sm btn-primary save-book" id="${bookNumber}" data-toggle="tooltip" data-placement="right"  data-trigger="manual" data-delay='{"show":"500", "hide":"300"}'>Save</a>
                                </div>
                                <img class="col-4" src="${book.volumeInfo.imageLinks.smallThumbnail}" alt="sans" />
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
            "image": data.items[e.target.id].volumeInfo.imageLinks.smallThumbnail,
            "id": data.items[e.target.id].id,
            "learnLink": `https://books.google.com/books?id=${data.items[e.target.id].id}`
        };

        

        savedBooks.forEach(book => {
        if(_.isEqual(book, newBook)){
            console.log("Duplicate found");
            duplicate = 1;}
        });

        $(function () {                             //Showing tooltips on 'save' click
            if (duplicate){
                console.log(duplicate);
                $(`#${e.target.id}`).tooltip({ "title": "Already saved!" });
                $(`#${e.target.id}`).tooltip('show');
            } 
        })

        
        $(`#${e.target.id}`).removeClass("btn-primary");
        $(`#${e.target.id}`).addClass("btn-success");
        $(`#${e.target.id}`).text("Saved");


        if (!duplicate){savedBooks.push(newBook)};

        localStorage.setItem('books', JSON.stringify(savedBooks));
        console.log(savedBooks);

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                db.collection("users").doc(`${user.displayName}`).set({
                    books: JSON.stringify(savedBooks)
                })
                    .then(function () {
                        console.log("Document successfully written!");
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            }
        })
        
    });

}

function handleSignUp() {
    var email = document.getElementById('sign-up-email').value;
    var username = document.getElementById('sign-up-username').value;
    var password = document.getElementById('sign-up-pw').value;
    var confPassword = document.getElementById('sign-up-pw-conf').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password with a length of at least four characters.');
        return;
    }
    if (password != confPassword) {
        alert('Passwords do not match!');
        return;
    }
    if (username.length < 4) {
        alert('Please enter a username with a length of at least four characters.');
        return;
    }
    // Create user with email and pass.
    // [START createwithemail]
    firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
        return firebase.auth().currentUser.updateProfile({
            displayName: username
        })
    })
    .then(() =>{
        const newUser = firebase.auth().currentUser; 
        db.collection("users").doc(`${newUser.displayName}`).set({
            username: newUser.displayName,
            email: newUser.email,
            books: JSON.stringify(savedBooks)
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            })
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}

function handleSignIn(e){
    e.preventDefault();
    console.log("handling sign-in...")
    var email = document.getElementById('sign-in-email').value;
    var password = document.getElementById('sign-in-pw').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        //document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    //console.log("logged in!")
    //authCheck();
}

// $(".nav-link").click(() => {
//     console.log("hi")
// });

function handleLogOut(){
    firebase.auth().signOut().then(function () {
        console.log("Signed Out")// Sign-out successful.
        $("#my-acc").text("Log In");
        $("#my-acc").attr('data-target', '#exampleModal')

        //localStorage.setItem(`books`, []);


    }).catch(function (error) {
        console.log(error)
        // An error happened.
    });
}

document.querySelector("#account-action-btn").addEventListener("click", handleSignUp);
document.querySelector("#sign-in-btn").addEventListener("click", handleSignIn);

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
                    retrievedBooks.forEach(book => {
                        savedBooks.push(book)
                    })
                    console.log(savedBooks);
                    //localStorage.setItem(`books`, retrievedBooks);
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });

            //console.log(retrievedBooks);

            db.collection("users").doc(`${user.displayName}`).set({
                //username: user.displayName,
                //email: user.email,
                books: JSON.stringify(savedBooks)
            }, { merge: true })
            console.log("DB change")

            //localStorage.setItem(`books`, JSON.stringify(savedBooks));

           

            // User is signed in.
            $("#acc-status").html(`You're logged in as <strong>${user.displayName}</strong>`);
            $('#exampleModal').modal('hide');
            $("#my-acc").attr('data-target', '')
            $("#my-acc").text("Log out");
            $("#my-acc").click(handleLogOut);

            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // ...
        } else {
            $("#acc-status").text(`You're not logged in`);

            // User is signed out.
            // ...
        }
    });
};

window.onload = function () {
    authCheck();
};

//<p class="card-text">${book.volumeInfo.title} was published in ${book.volumeInfo.publishedDate} by ${book.volumeInfo.publisher}. The book, written by ${book.volumeInfo.authors}, has ${book.volumeInfo.pageCount} pages. It is considered to be a ${book.volumeInfo.categories} book.</p>