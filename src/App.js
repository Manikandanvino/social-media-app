import { useEffect, useState } from 'react';
import About from './About';
import './App.css';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Missing from './Missing';
import Nav from './Nav';
import NewPost from './NewPost';
import PostPage from './PostPage';
import {format} from 'date-fns'
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
function App() {
  const [posts,setPosts] = useState([])
  const [searchResults,setSearchResults] = useState([])
   const [search,setSearch] = useState('')
   const [postTitle, setPostTitle] = useState('');
   const [postBody, setPostBody] = useState('');
   const navigate = useNavigate()

   useEffect(()=>{
       const fetchPosts = async()=>{
        try{
          const responce = await axios.get('https://json-server-utrs.onrender.com/posts');
          setPosts(responce.data);
        }catch(err){
          if(err){
            console.log(err.responce.data);
            console.log(err.responce.status);
            console.log(err.responce.headers);
          }else{
            console.log(`Error: ${err.message}`);
          }
        }
       }
       fetchPosts();
   },[])

   useEffect(()=>{
   const filteredResults = posts.filter((post)=>
   ((post.body).toLowerCase()).includes(search.toLowerCase())
   || ((post.title).toLowerCase()).includes(search.toLowerCase()));

   setSearchResults(filteredResults.reverse());
   }, [posts, search])

   const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try{
      const responce = await axios.post('https://json-server-utrs.onrender.com/posts',newPost)
      const allPosts = [...posts, responce.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    }catch(err){
      if(err){
        console.log(err.responce.data);
        console.log(err.responce.status);
        console.log(err.responce.headers);
      }else{
        console.log(`Error: ${err.message}`);
      }
    }
    
    }

    const handleDelete = async (id)=>{
      try{
        await axios.delete(`https://json-server-utrs.onrender.com/posts/${id}`)
        const postsList =posts.filter(post=>post.id!==id);
        setPosts(postsList);
        navigate('/');
      }catch(err){
        if(err){
          console.log(err.responce.data);
          console.log(err.responce.status);
          console.log(err.responce.headers);
        }else{
          console.log(`Error: ${err.message}`);
        }
      }
      
    }

  return (
    <div className="App">
        <Header title="Manish Social Media"/>
        <Nav 
          search={search}
          setSearch={setSearch}
        />
        <Routes>
           <Route path='/' element={ <Home posts={searchResults}/> } />
            <Route path='post'> 
              <Route index element={<NewPost
                handleSubmit={handleSubmit}
                postBody={postBody}
                postTitle={postTitle}
                setPostBody={setPostBody}
                setPostTitle={setPostTitle}/>}
              /> 
              <Route path=':id' element={<PostPage posts={posts} handleDelete={handleDelete}/>} />
            </Route>
            <Route path='about' element={<About/>}/>
            <Route path='*' element={<Missing/>}/>
        </Routes>
        
        <Footer/>
    </div>
  );
}

export default App;
