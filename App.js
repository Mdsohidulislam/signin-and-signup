// import Header from './components/Header/Header';
// import Shop from './components/Shop/Shop';
// import {Route,Switch,Link} from 'react-router-dom';
// import NotFound from './components/NotFound/NotFound';
// import Inventory from './components/Inventory/Inventory'
// import Review from './components/Review/Review';
// import PorductDetail from './components/ProductDetail/PorductDetail';
// import Login from './components/Login/Login';
// import Shipment from './components/Shipment/Shipment'

// const App=()=>{
//   return (
//     <div>  
//       <Header></Header>
//       <Switch>
//           <Route path='/shop'>
//             <Shop></Shop>
//           </Route>
//           <Route path='/review'> 
//             <Review></Review>
//           </Route>
//           <Route path='/inventory'> 
//             <Inventory></Inventory>
//           </Route>
//           <Route path='/login'> 
//             <Login></Login>
//           </Route>
//           <Route path='/shipment'> 
//             <Shipment></Shipment>
//           </Route>
//           <Route exact path='/'>
//             <Shop></Shop>
//           </Route>
//           <Route path='/product/:productKey'>
//               <PorductDetail></PorductDetail>
//           </Route>
//           {/* path='*' sob niche dite hobe na hole kaj korbe na */}
//           <Route path='*'>
//               <NotFound></NotFound>
//           </Route>
//       </Switch>

//       {/* <h1>Hi, I am md sohidul islam. I am from Bangladesh</h1> */}
//     </div>
//   )
// }


// export default App;





import React, { useState } from 'react';
import './App.css'
import firebase from 'firebase/app'
import 'firebase/auth'
import TextField from '@material-ui/core/TextField';

const firebaseConfig = {
  apiKey: "AIzaSyCqZ5oJv_UqQ6cOSd-BLZ3arq9ql3bD0Zo",
  authDomain: "rahims-sweets.firebaseapp.com",
  projectId: "rahims-sweets",
  storageBucket: "rahims-sweets.appspot.com",
  messagingSenderId: "345823687656",
  appId: "1:345823687656:web:417457b03b788e0eb8aa5d"
};

firebase.initializeApp(firebaseConfig);




const App = () => {
  
  const [loginUser,setLoginUser]=useState({
    name:'',
    email:'',
    photo:'',
    success:false,
    error:'',
    message:''
  })

  const {name,email,photo,success,error,message}=loginUser;

  const [user,setUser]=useState({
    name:'',
    email:'',
    password:'',
    isSignedIn:false,
  })

  var provider = new firebase.auth.GoogleAuthProvider();
  const  handleSignedIn=()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const user=res.user;
      setUser({
        name:user.displayName,
        email:user.email,
        photo:user.photoURL,
        isSignedIn:true
      })
    }).catch(error=>{
      console.log(error.message);
    })
  }


  const handleSignedOut=()=>{
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      setUser({
        name:'',
        email:'',
        photo:'',
        isSignedIn:false,
        error:'',
        success:false
      })

      console.log('sign-out successful');
    }).catch((error) => {
      // An error happened.
      console.log(error.message);
    });
  }

  const handleBlur=(event)=>{
    let isFormValid=true;
    if(event.target.name==='email'){
      isFormValid=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(event.target.value);
    }if(event.target.name==='password'){
      isFormValid=/^[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(event.target.value);
    }if(isFormValid){
      let newUserInfo={...user}
          newUserInfo[event.target.name]=event.target.value;
          setUser(newUserInfo)
    }
  }

  const [newUser,setNewUser]=useState(false)

  const handleSubmit=(event)=>{
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((res) => {  
      const logUser=res.user;
      const newLoginUser={...loginUser}
      newLoginUser.success=true;
      newLoginUser.message='created'
      newLoginUser.error='';
      newLoginUser.name=logUser.displayName;
      newLoginUser.email=logUser.email;
      newLoginUser.photo=logUser.photoURL; 
      setLoginUser(newLoginUser); 
      updateUserInfo(user.name,user.photo)
    })
    .catch((error) => {
      const newLoginUser={...loginUser}
      newLoginUser.success=false;
      newLoginUser.error=error.message;
      setLoginUser(newLoginUser);
    });
    }

    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        
        const logUser=res.user;
        const newLoginUser={...loginUser}
        newLoginUser.success=true;
        newLoginUser.message='logged in'
        newLoginUser.error='';
        newLoginUser.name=logUser.displayName;
        newLoginUser.email=logUser.email;
        newLoginUser.photo=logUser.photoURL; 
        setLoginUser(newLoginUser); 
      })
      .catch((error) => {
        const newLoginUser={...loginUser}
        newLoginUser.success=false;
        newLoginUser.error=error.message;
        setLoginUser(newLoginUser);
      });
    }


    event.preventDefault()
  }

  const updateUserInfo=(name,photo)=>{
    var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name,
  photoURL:photo
}).then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});
  }

  return (
    <div style={{textAlign:'center'}}>
      <div className="sign-in-and-out">
      {user.isSignedIn ? <h4>Hey,{user.name} your profile ready....</h4> : <h1>Sign in with Google</h1>}
      {user.isSignedIn ? <button onClick={handleSignedOut}>Sign out</button>: <button onClick={handleSignedIn}>Sign in</button>}
      {
        user.isSignedIn && <div>
            <h4>Welcome,{user.name}</h4>
            <h4>Your email is {user.email}</h4>
            <img src={user.photo} alt=""/>
          </div>
      }
      </div>
      <div className="signUp-signIn-container">
      <form onSubmit={handleSubmit}  noValidate autoComplete="off">
      <input className='checkbox' onClick={()=>setNewUser(!newUser)} type="checkbox"/><label htmlFor="">New user sign up</label><br/>
      {newUser &&
      <TextField onBlur={handleBlur} name='name' id="standard-basic" label="Name" /> }<br/>
      {newUser &&
      <TextField onBlur={handleBlur} name='photo' id="standard-basic" label="PhotoURL" /> }<br/>
      <TextField onBlur={handleBlur} name='email' id="standard-basic" label="Email" type='email'/><br/>
      <TextField onBlur={handleBlur} name='password' id="standard-basic" label="Password" type='password'/><br/><br/>
      <TextField style={{width:'200px'}} type='submit' value='Submit' variant="outlined" /><br/><br/>
      </form>
      {
        success ? <p style={{color:'green'}}>Account {message} successfully</p> :<p style={{color:'red'}}>{error}</p>
      }
      <br/><br/>
          {success &&
      <div>
            <h1>Profile...</h1>
            <hr/><hr/>
            <h4>Welcome , {name}</h4>
            <h4>Your email is...{email}</h4>
            <img style={{height:'200px'}} src={photo} alt=""/>
            </div>}
      </div>
    </div>
  );
};

export default App;