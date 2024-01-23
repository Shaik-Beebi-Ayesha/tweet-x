import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { doc, updateDoc ,getDoc } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { updateFollowed} from '../redux/features/featuresSlice';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Users = () => {
  const [users, setUsers] = useState([]);
  const userId = useSelector((state) => state.features.uid);
  const userName = useSelector((state) => state.features.userName);

  const dispatch = useDispatch();
  const [userDropdownState, setUserDropdownState] = useState({});
  const [currUser,setCurrUser] = useState(null);

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
        const curr = fetchedUsers.find((user) => user.uid === userId);
        setUsers(filteredUsers);
        setCurrUser(curr);
      } catch (error) {
        console.error('Error getting users:', error);
      }
    };

    fetchUsers();
  }, [userId]);

  const followed = useSelector((state) => state.features.followed);
  const isLoggedIn = useSelector((state) => state.features.isLoggedIn);
  const navigate = useNavigate();

  const handleFollow = async (user) => {
    if (isLoggedIn) {
      const isAlreadyFollowed = followed.some((followedUser) => followedUser.id === user.id);
      if (!isAlreadyFollowed) {
        const updatedFollowed = [user, ...followed];
        dispatch(updateFollowed(updatedFollowed));
  
        try {
          const userDocRef = doc(db, 'users', user.id);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
          await updateDoc(userDocRef, {
            followers: [
              ...userData.followers,
              { id: userId, username: userName, following: followed?.length },
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
    const updatedFollowed = followed.filter((followedUser) => followedUser.id !== uId);
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
    <div>
      <div className='following flex justify-center items-center my-10'>
        <ul>
          {users.map((user, index) => (
            <li key={index} className=''>
              <div className='flex items-center justify-between gap-[10px] md:gap-[100px]'>
                <div className='flex items-center'>
                  <img
                    src=''
                    className='mx-3 md:mx-10 my-5 w-[40px] h-[40px] md:w-[70px] md:h-[70px] rounded-full border-[2px] border-gray-400'
                  />
                  <div>
                    <p className='font-semibold text-gray-500 my-3'>{user.username}</p>
                    <p className='text-xs text-gray-500'>Following : {user.followed.length} </p>
                  </div>
                </div>
                <div>
                <button
                  className={`py-1 px-4 text-sm rounded-md ${
                    followed.some((followedUser) => followedUser.id === user.id)
                      ? 'bg-gray-200'
                      : 'bg-rose-400 text-white'
                  }`}
                  onClick={() => handleFollow(user)}
                >
                 {followed.some((followedUser) => followedUser.id === user.id) ? (
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
    </div>
  );
};

export default Users;
