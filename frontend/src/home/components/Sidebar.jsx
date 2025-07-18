import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../Zustans/useConversation.jsx';


const Sidebar = ({ onSelectUser }) => {

  const navigate = useNavigate();
  const {authUser, setAuthUser} = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [searchUser, setSearchuser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSetSelectedUserId] = useState(null);
  const {message, selectedConversation, setSelectedConversation} = userConversation();


//Show users with YOU chatted...
  useEffect(()=>{
    const chatUserHandler=async()=>{
        try {
          const chatters = await axios.get(`/api/user/currentchatters`);
          const data = chatters.data;
          if(data.success === false){
            setLoading(false)
            console.log(data.message)
          }
          setLoading(false)
          setChatUser(data);

        } catch (error) {
          setLoading(false)
          console.log(error);
        }
    }
    chatUserHandler()
  },[])
  
//Show user from the search result...
  const handleSearchSubmit=async(e)=>{
      e.preventDefault();
      setLoading(true)
      try {
          const search = await axios.get(`api/user/search?search=${searchInput}`)
          const data = search.data;
          if(data.success === false){
            setLoading(false)
            console.log(data.message)
          }
            setLoading(false)
            if(data.length === 0){
              toast.info("User not Found")
            }else{
              setSearchuser(data)
            }
      } catch (error) {
          setLoading(false);
          console.log(error);
      }
  }

//Show which user is Selected...
    const handleUserClick=(user)=>{
      onSelectUser(user);
      setSelectedConversation(user);
      setSetSelectedUserId(user._id);
    }

//Back from Search result...
    const handleSearchback=()=>{
      setSearchuser([])
      setSearchInput('')
    }

//Logout...
    const handleLogOut=async()=>{

      const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
      if(confirmlogout === authUser.username){
        setLoading(true)
      try {
        const logout = await axios.post('/api/auth/logout')
        const data = logout.data;
        if(data.success === false){
          setLoading(false)
          console.log(data.message);
        }
        toast.info(data.message)
        localStorage.removeItem('ChatApp(2.0)')
        setAuthUser(null)
        setLoading(false)
        navigate('/login')
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
      }else{
        toast.info("LogOut Cancelled");
      }
    }


  return (
    <div className='h-full w-auto px-1'>
        <div className='flex justify-between gap-2'>
          <form onSubmit={handleSearchSubmit} className='w-auto flex items-centre justify-between bg-white rounded-full'>
            <input value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} type='text' className='px-4 w-auto bg-transparent outline-none rounded-full'
                   placeholder='search user' />
            <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
            <FaSearch size={15.5}/>
            </button>
          </form>
          <img onClick={()=>navigate(`/profile/${authUser?._id}`)} 
                 src={authUser?.profilepic}
                 className='self-center h-12 w-12 hover:scale-110 cursor-pointer'/>
        </div>
        <div className='divider px-3'></div>
        {searchUser?.length > 0 ? (
          <>
          <div className="min-h-[70%] max-h[80%] m overflow-y-auto scrollbar">
            <div className='w-quto'>
              {searchUser.map((user, index) => (
                <div key={user._id}>
                    <div onClick={()=> handleUserClick(user)}
                         className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                         ${selectedUserId === user?._id ? 'bg-sky-500' : '' }`}>

                          <div className='avatar'>
                              <div className='w-12 rounded-full h-12'> 
                                <img src={user.profilepic} alt='user.img'/>
                              </div>
                              </div>
                              <div className='flex flex-col flex-1'> 
                                <p className='font-bold text-gray-950'>{user.username}</p>
                              </div>
                    </div>
                    <div className='divider divide-solid px-3 h-[1px]'></div>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-auto px-1 py-1 flex'>
            <button onClick={handleSearchback} className='bg-white rounded-full px-2 py-1 self-center'>
              <IoArrowBackSharp size={25} />
            </button>
          </div>
          </>
        ):(
          <>
          <div className="min-h-[70%] max-h[80%] m overflow-y-auto scrollbar">
            <div className='w-quto'>
               { chatUser.length === 0 ? (
                <>
                <div className='font-bold items-center flex flex-col text-xl text-yellow-500'>
                              <h1>Why Are You Alone.?</h1>
                              <h1>Search Username to Chat.</h1>
                </div>
                </>
               ) : (
                <>
                {chatUser.map((user, index)=>(
                  <div key={user._id}>
                    <div onClick={()=> handleUserClick(user)}
                         className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                         ${selectedUserId === user?._id ? 'bg-sky-500' : '' }`}>

                              <div className='avatar'>
                              <div className='w-12 rounded-full h-12'> 
                                <img src={user.profilepic} alt='user.img'/>
                              </div>
                              </div>
                              <div className='flex flex-col flex-1'> 
                                <p className='font-bold text-gray-950'>{user.username}</p>
                              </div>
                          
                    </div>
                    <div className='divider divide-solid px-3 h-[1px]'></div>
                  </div>
                ))}
                </>
               ) } 
            </div>
          </div>
          <div className='mt-auto px-1 py-1 flex'>
            <button onClick={handleLogOut} className='hover:bg-red-600 flex w-10 cursor-pointer hover:text-white rounded-lg'>
              <BiLogOut size={25}/>
            </button>
            <p className='text-sm py-1'>LogOut</p>
          </div>
          </>
        )}
    </div>
  )
}

export default Sidebar;



