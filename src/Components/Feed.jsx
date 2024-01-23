import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import { formatDistanceToNow } from 'date-fns';
import { updateFeed } from '../redux/features/featuresSlice';

function Feed() {
  const [showInput, setShowInput] = useState(false);
  const [feed,setFeed] = useState([]);
  const [inputText, setInputText] = useState('');
  const texts = useSelector((state) => state.features.feed);

  

  const userName = useSelector((state) => state.features.userName);
  const following = useSelector((state) => state.features.followed);

  
  useEffect(() => {
    const updatedFeed = following
      .map((followedUser) => followedUser.feed)
      .flat();
    const sortedFeed = [...updatedFeed,...texts].sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return timestampB - timestampA;
    });
    setFeed(sortedFeed);
  }, [following,texts]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userName) {
      navigate('/login');
    }
  }, [userName]);

  const handleFeed = () => {
    setShowInput(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() !== '') {
      const newContent = { content: inputText.trim(),userName, timestamp: new Date().toISOString()};
      const updatedTexts = [newContent, ...texts];
      dispatch(updateFeed(updatedTexts));
      
      setInputText('');
      setShowInput(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date) ? new Date() : date;
  };

  return (
    <div className='flex md:justify-center md:items-center my-10 mx-2 md:mx-0'>
      <div className='w-[70%] md:w-[30%]'>
        {!showInput && (
          <button
            onClick={handleFeed}
            className='bg-rose-400 text-white py-1 px-4 text-sm rounded-md'>
            Write
          </button>
        )}
        {showInput && (
          <div className=''>
            <textarea
              className='w-[350px] h-[100px] border-black border-[1px] rounded-md p-2'
              type='text'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={200}
              placeholder={`What's happening ?`}
            />
            <div>
              <button
                className='bg-rose-400 text-white py-1 px-4 text-sm rounded-md'
                onClick={handleSubmit}>Tweet</button>
            </div>
          </div>
        )}
        <div className='my-5'>
          {feed.map((item, index) => (
            <div key={index} className='my-5 w-[350px] md:w-[400px] h-[120px] bg-[#f8f8f8] overflow-hidden shadow-md rounded-md py-4 px-4 flex gap-[20px]'>
              <img src='' className='rounded-full w-[50px] h-[50px] border-[2px] border-gray-500' />
              <div style={{ width: 'calc(100% - 70px)' }}>
                <div className='flex justify-between items-center'>
                  {userName && <div className='font-bold text-gray-500 text-xl'>{item.userName.toUpperCase()}</div>}
                  <div className='text-xs'>{formatDistanceToNow(formatTimestamp(item.timestamp), { addSuffix: true })}</div>
                </div>
                <div className='h-[50px] w-[50px] rounded-full bg-rose-400 float-right relative left-10'></div>
                <p className='text-xs mt-3' style={{ wordWrap: 'break-word' }}>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;