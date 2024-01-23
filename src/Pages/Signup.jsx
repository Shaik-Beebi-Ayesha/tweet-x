import React,{useState} from 'react'
import tweetXImage from '../assets/tweetx.png'
import {Link,useNavigate} from 'react-router-dom'
import { auth,db } from '../firebase/firebaseConfig';
import {doc,setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword , updateProfile } from 'firebase/auth';


const Signup = () => {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [error,setError] =useState("");
  
  const navigate = useNavigate();

  const handleSignup = async ()=>{
    setError("")
    if(email && name && password==confirmPassword){
      await createUserWithEmailAndPassword(auth,email,password).then(async(userCredential)=>{
        const user = userCredential.user;
        await setDoc(doc(db, "users",user.uid), {
          isLoggedIn: false,
          username: name, 
          feed : [],
          followed : [],
          followers : [],
          uid : user.uid
        });
        updateProfile(user, {
          displayName: name,
        });
        setName("");
        setEmail("");
        setPassword("");
        navigate('/login');
      })
      .catch((error)=>{
        setError(error.message);
        alert(error.message)
      })
    }
    else{
      setError("Passwords didn't match !")
    }
  }
  return (
    <>
    <div className='h-screen w-full flex'>
        <div className='w-[100%] sm:w-[80%] md:w-[50%] h-full'>
          <h3 className='text-rose-400 font-semibold text-2xl mx-10 mt-10 mb-5'>TweetX</h3>
          <Link to='/login'><button className='py-1 px-10 border-[0.5px] border-black rounded-md text-sm mx-10 font-bold'>Login</button></Link>
          <div className='m-10'>
            <h1 className='text-2xl font-bold text-gray-500'>Create Account</h1>
            <div className='my-3'>
              <input type='text'
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder='Name'
              className='p-2 px-4 rounded-md bg-gray-100 text-sm w-[100%] md:w-[55%] my-4'/>
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
              <input type='password'
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              placeholder='Confirm Password'
              className='p-2 px-4 rounded-md bg-gray-100 text-sm w-[100%] md:w-[55%] my-4'/>
            </div>
            <button 
            onClick={handleSignup}
            className='bg-rose-400 text-white py-1 px-4 text-sm rounded-md ml-[40%]'>Sign up</button>
          </div>
        </div>
        <div className='hidden md:block w-[50%] h-full'>
            <img src={tweetXImage}/>
        </div>
    </div> 
    </>
  )
}

export default Signup
