import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';

const func = async () => {
  const res = await axios.get('/api');
  return res.data
}

function App() {

  const [data, setdata] = useState("")
  useEffect(() => {
    func().then(data => {
      setdata(data)
    })

  }, [])
  return (
    <div className="App">
      {data.msg}
    </div>
  );
}

export default App;
