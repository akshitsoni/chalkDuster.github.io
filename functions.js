function click(elementId,fn) {
  var element=document.getElementById(elementId);
  if(element)
    element.addEventListener("click",fn);
}

function logInWithGoogle() {
  console.log("Logging in with google");
  var provider=new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    createUser(user.uid,user.displayName,user.email,user.photoURL);
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    console.log(errorCode+" "+errorMessage);
  });
}

function logInUser() {
  logInWithGoogle();
}

function createUser(uid,uname,uemail,photoURL) {
  var database=firebase.database();
  var usersRef=database.ref("users");
  var user = {
    id: uid,
    name: uname,
    email: uemail,
    imageURL: photoURL
  };
  usersRef.child(uid).set(user).then(function() {
    redirect("whiteboard/examples/basic/newIndex.html");
  });
}

function redirect(path) {
  window.location=path;
}

function ifUserIsLoggedIn(fn) {
  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      window.currentUser = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        imageUrl: user.photoURL
      }
      fn();
    }
    else {
      redirect("index.html");
    }
  });
}

function updateUserData() {
  var user=window.currentUser;
  var nameArea=document.getElementById("username");
  var profilePicture=document.getElementById("user_image");
  profilePicture.src=user.imageUrl;
  nameArea.textContent = user.name;
  console.log(nameArea);
  console.log(user.imageUrl);
}
