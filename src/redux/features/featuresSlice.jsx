import { createSlice } from '@reduxjs/toolkit';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';


const initialState = {
  isLoggedIn: false,
  uid: '',
  feed: [],
  followed: [],
  userName: '',
  followers: [],
};

export const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setUid(state, action) {
      state.uid = action.payload;
    },
    setUserName(state, action) {
      state.userName = action.payload;
    },
    setFeed(state, action) {
      state.feed = action.payload;
    },
    setFollowed(state, action) {
      state.followed = action.payload;
    },
    setFollowers(state, action) {
      state.followers = action.payload;
    },
  },
});

export const {
  setIsLoggedIn,
  setUserName,
  setUid,
  setFeed,
  setFollowed,setFollowers,
} = featuresSlice.actions;

export const updateFeed = (updatedFeed) => async (dispatch, getState) => {
  dispatch(setFeed(updatedFeed)); 
  const { features } = getState(); 
  await updateFirestore(features); 
};
export const updateFollowed = (updatedFollowed) => async (dispatch, getState) => {
  dispatch(setFollowed(updatedFollowed)); 
  const { features } = getState(); 
  await updateFirestore(features); 
};
export const updateFollowers = (updatedFollowers) => async (dispatch, getState) => {
  dispatch(setFollowers(updatedFollowers)); 
  const { features } = getState(); 
  await updateFirestore(features); 
};

const updateFirestore = async ({ uid, feed, followed }) => {
  try {
    const dataToUpdate = { feed , followed };
    await updateDoc(doc(db, 'users', uid), dataToUpdate);
  } catch (error) {
  }
};

export default featuresSlice.reducer;
