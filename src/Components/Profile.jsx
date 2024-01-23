import React,{useEffect,useState} from 'react'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useSelector,useDispatch } from 'react-redux';
import { doc, updateDoc ,getDoc } from 'firebase/firestore';
import {useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { updateFollowed} from '../redux/features/featuresSlice';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

const Profile = () => {

  const [users, setUsers] = useState([]);
  const userId = useSelector((state) => state.features.uid);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() });
        });
        const filteredUsers = fetchedUsers.filter((user) => user.uid !== userId);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error getting users:', error);
      }
    };

    fetchUsers();
  }, [userId]);
  const userName = useSelector((state)=>state.features.userName);
  const isLoggedIn = useSelector((state) => state.features.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userName) {
      navigate('/login');
    }
  }, [userName]);

  const feed = useSelector((state) => state.features.feed);
  
  const following = useSelector((state) => state.features.followed);
  const followers = useSelector((state) => state.features.followers);
  
  const FollowersUsers = users.filter((user) => {
    return followers.some((follower) => follower.id === user.uid);
  });
  console.log(FollowersUsers)

  const [activeTab, setActiveTab] = useState('posts'); 
  const [userDropdownState, setUserDropdownState] = useState({});

  const handleFollow = async (user) => {
    if (isLoggedIn) {
      const isAlreadyFollowed = following.some((followedUser) => followedUser.id === user.id);
      if (!isAlreadyFollowed) {
        const updatedFollowed = [user, ...following];
        dispatch(updateFollowed(updatedFollowed));
  
        try {
          const userDocRef = doc(db, 'users', user.id);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
          await updateDoc(userDocRef, {
            followers: [
              ...userData.followers,
              { id: userId, username: userName, following: following?.length },
            ],
          });
        } catch (error) {
          // Handle error
          console.error('Error updating user document:', error);
        }
      } else {
        setUserDropdownState((prevState) => ({
          ...prevState,
          [user.id]: !prevState[user.id],
        }));
      }
    } else {
      navigate('/login');
    }
  };
  

  const handleUnfollow = async (uId) => {
    const updatedFollowed = following.filter((followedUser) => followedUser.id !== uId);
    dispatch(updateFollowed(updatedFollowed));
  
    try {
      const userDocRef = doc(db, 'users', uId);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      await updateDoc(userDocRef, {
        followers: userData.followers.filter((follower) => follower.id !== userId),
      });
  
      setUserDropdownState((prevState) => ({
        ...prevState,
        [uId]: !prevState[uId],
      }));
    } catch (error) {
      console.error('Error updating user document:', error);
    }
  };
  return (
    <>
     <div className='flex justify-center items-center my-10'>
      <div className='flex gap-[10px] md:gap-[40px] items-center'>
        <img src='' className='w-[70px] h-[70px] md:w-[100px] md:h-[100px] border-gray-500 border-[2px] rounded-full'/>
        <div className=''>
          <p className='text-2xl text-gray-400 font-semibold my-5'>{userName.toUpperCase()}</p>
          <div className='flex gap-[20px]'>
          <p className='text-xs text-gray-400 font-semibold'>Posts : {feed?.length}</p>
          <p className='text-xs text-gray-400 font-semibold'>Followers : {followers?.length} </p>
          <p className='text-xs text-gray-400 font-semibold'>Following : {following?.length}</p>
          </div>
        </div>
      </div>
    </div> 
    <hr className='border-t-[2px] border-gray-200 w-[100%] md:w-[50%] mx-auto'/>
    <div>
      <div className='flex w-[90%] md:w-[40%] justify-between mx-auto'>
        <p
          onClick={() => setActiveTab('posts')}
          className={`text-sm mt-1 ${
            activeTab === 'posts'
              ? 'text-black relative'
              : 'text-gray-400'
          }`}
        >
          <DynamicFeedIcon/> Posts
          {activeTab === 'posts' && (
            <span className="absolute top-[-7px] left-1/2 transform -translate-x-1/2 w-[150%] h-[2px] bg-gray-400" />
          )}
        </p>
        <p
          onClick={() => setActiveTab('followers')}
          className={`text-sm mt-1 ${
            activeTab === 'followers'
              ? 'text-black relative'
              : 'text-gray-400'
          }`}
        >
          <DynamicFeedIcon/> Followers
          {activeTab === 'followers' && (
           <span className="absolute top-[-7px] left-1/2 transform -translate-x-1/2 w-[150%] h-[2px] bg-gray-400" />
          )}
        </p>
        <p
          onClick={() => setActiveTab('following')}
          className={`text-sm mt-1 ${
            activeTab === 'following'
              ? 'text-black relative'
              : 'text-gray-400'
          }`}
        >
          <DynamicFeedIcon/> Following
          {activeTab === 'following' && (
            <span className="absolute top-[-7px] left-1/2 transform -translate-x-1/2 w-[150%] h-[2px] bg-gray-400" />
          )}
        </p>
      </div>
      <div>
        {activeTab === 'posts' && (
          <div className='posts flex md:justify-center md:items-center my-10'>
          <div className='w-[300px] md:w-[30%]'>
            <div className='my-5'>
              {feed.map((item, index) => (
                <div key={index} className='my-5 w-[120%] h-[120px] bg-[#f8f8f8] overflow-hidden shadow-md rounded-md py-4 px-4 flex gap-[20px]'>
                  <img src='' className='rounded-full w-[50px] h-[50px] border-[2px] border-gray-500' />
                  <div style={{ width: 'calc(100% - 70px)' }}>
                    <div className='flex justify-between items-center'>
                      {userName && <div className='font-bold text-gray-500 text-xl'>{userName.toUpperCase()}</div>}
                      <div className='text-xs'>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</div>
                    </div>
                    <div className='h-[50px] w-[50px] rounded-full bg-rose-400 float-right relative left-10'></div>
                    <p className='text-xs mt-3' style={{ wordWrap: 'break-word' }}>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
        {activeTab === 'followers' && (
          <div className='following flex justify-center items-center my-10'>
          <ul>
            {FollowersUsers.map((user, index) => (
              <li key={index} className=''>
                <div className='flex items-center justify-between gap-[20px] md:gap-[100px]'>
                  <div className='flex items-center'>
                    <img
                      src=''
                      className='mx-3 md:mx-10 my-5 w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full border-[2px] border-gray-400'
                    />
                    <div>
                      <p className='font-semibold text-gray-500 my-3'>{user.username.toUpperCase()}</p>
                      <p className='text-xs text-gray-500'>Following : {user.followed.length} </p>
                    </div>
                  </div>
                  <div>
                  <button
                    className={`py-1 px-4 text-sm rounded-md ${
                      following.some((followedUser) => followedUser.id === user.id)
                        ? 'bg-gray-200'
                        : 'bg-rose-400 text-white'
                    }`}
                    onClick={() => handleFollow(user)}
                  >
                   {following.some((followedUser) => followedUser.id === user.id) ? (
    <div className="flex items-center">
      <span>Following </span>
      <ArrowDropDownIcon/>
    </div>
  ) : (
    'Follow'
  )}
                    
                  </button>
                  {userDropdownState[user.id] && (
                      <div className='relative bg-rose-400 p-1 px-3 rounded-md text-white text-sm'>
                        <button onClick={() => handleUnfollow(user.id)}>Unfollow</button>
                      </div>
                    )}
                  </div>
                </div>
                <hr />
              </li>
            ))}
          </ul>
        </div>
        )}
        {activeTab === 'following' && (
          <div className='following flex justify-center items-center my-10'>
            <ul>
            {following.map((user, index) => (
              <li key={index} className=''>
                <div className='flex items-center justify-between gap-[40px] md:gap-[100px]'>
                  <div className='flex items-center'>
                    <img src={user.image} className='mx-3 md:mx-10 my-5 w-[70px] h-[70px] rounded-full border-[2px] border-gray-400'  />
                    <div>
                      <p className='font-semibold text-gray-500 my-3'>{user.username.toUpperCase()}</p>
                      <p className='text-xs text-gray-500'>Following : {user.followed.length}</p>
                    </div>
                  </div>
                  <p className='text-sm text-gray-500 font-semibold'>Following</p>
                </div>
                <hr />
              </li>
            ))}
          </ul>
          </div>
        )}
      </div>
    </div>
    
    <div>
    
      </div>
    </>
  )
}

export default Profile
