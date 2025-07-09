
import React from 'react'
import '../styles/Home.css'
import Navbar from './Navbar.jsx'
import Header from './Header.jsx'
import Menubar from './menubar.jsx'
import Recoms from './Recoms.jsx'



const Home = () => {
    return (
        <div className='headerslider'>
            <Navbar />
            <Header />
            <Menubar />
            <Recoms />


        </div>
    )
}

export default Home
