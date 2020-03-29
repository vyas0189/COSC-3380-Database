import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [idInput, setidInput] = useState('')
  const [data, setData] = useState([]);
  const [errMsg, seterrMsg] = useState('')
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   (async () => {
  //     setLoading(true);
  //     const res = await axios.get('/api/users');
  //     setData(res.data);
  //     setLoading(false);
  //   })()
  // }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await axios.post('/api/users', { id: idInput });
    if (res.data.message) {
      setErr(true)
      seterrMsg(res.data.message)
    } else {
      setData(res.data);
      setErr(false);
    }
    setLoading(false);
  }

  const handleChange = (e) => {
    setidInput(e.target.value)
  }

  return (
    <div className="App">
      <h1>Length of the Data: {data.length}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="ID" value={idInput} onChange={handleChange} />
        <button type="submit">Search</button>
      </form>
      {
        loading ? <h1>Loading...</h1> :
          err ? <h1>{errMsg}</h1> :
            data ? data.map(user => <div key={user.id}>
              <p>ID: {user.id}</p>
              <p>First Name: {user.first_name}</p>
              <p>Last Name: {user.last_name}</p>
              <p>Age: {user.age}</p>
              <p>Email: {user.email}</p>
            </div>) : <div>Hello World</div>
      }
    </div >
  );
}

export default App;
