import React,{useState} from 'react'
import tweetXImage from '../assets/tweetx.png'
import {Link,useNavigate} from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn, setUserName, setUid ,setFeed, setFollowed,setFollowers} from '../redux/features/featuresSlice';


const Login = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        dispatch(setIsLoggedIn(true));
        dispatch(setUserName(docSnap.data().username || ""));
        dispatch(setUid(docSnap.data().uid));
        dispatch(setFeed(docSnap.data().feed));
        dispatch(setFollowed(docSnap.data().followed));
        dispatch(setFollowers(docSnap.data().followers));
        await updateDoc(docRef, {
          isLoggedIn: true,
        });
        navigate('/');
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      setError(error.message);
      alert(error.message)
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); 
    if (!email) {
      alert('Please enter your email address.');
      return; 
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent!');
    } catch (error) {
      const errorMessage = error.message;
      console.error(errorMessage);
    }
  };
  
  return (
    <>
    <div className='h-screen w-full flex'>
        <div className='w-[100%] sm:w-[80%] md:w-[50%] h-full'>
          <h3 className='text-rose-400 font-semibold text-2xl mx-10 mt-10 mb-5'>TweetX</h3>
          <Link to='/signup'><button className='py-1 px-10 border-[0.5px] border-black rounded-md text-sm mx-10 font-bold'>Create Account</button></Link>
          <div className='m-10'>
            <h1 className='text-2xl font-bold text-gray-500'>Login</h1>
            <div className='my-3'>
              <input type='email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder='Email'
              className='p-2 px-4 rounded-md bg-gray-100 text-sm w-[100%] md:w-[55%] my-4'/>
              <input type='password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder='Password'
              className='p-2 px-4 rounded-md bg-gray-100 text-sm w-[100%] md:w-[55%] my-4'/>
            </div>
            <div className='flex'>
            <p 
            onClick={handleResetPassword}
            className='text-sm font-semibold hover:underline'>Forgot Password ?</p>
            <button 
            onClick={handleLogIn}
            className='bg-rose-400 text-white py-1 px-4 text-sm rounded-md ml-[20%]'>Login</button>
            </div>
        </div>
        </div>
        <div className='hidden md:block w-[50%] h-full'>
            <img src={tweetXImage}/>
        </div>
    </div> 
    </>
  )
}

export default Login
