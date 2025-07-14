
import React from 'react'
import '../styles/Home.css'
import Navbar from './Navbar.jsx'
import Header from './Header.jsx'
import Menubar from './Menubar.jsx'
import Recoms from './Recoms.jsx'


function Home() {
    return (
        <div className='homeslider'>
            <Navbar />
            <Header />
            <Menubar />
            <Recoms />


        </div>
    )
}

export default Home
