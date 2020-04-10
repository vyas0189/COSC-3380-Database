import React from 'react'
import './Home.css';
import logo from './logo.png';

console.log(logo); //logo192.png

function Home() {

    const homestyle = {
        background: 'red', color: 'white', width: '110px'
    }

    return (
        <div className ="home" >
            <img src={logo} alt="Logo" />;
            <logo192> </logo192>
            <h1 style = {homestyle}>Home</h1>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <h1>About Us:</h1>
        </div>
    )
}

export default Home
