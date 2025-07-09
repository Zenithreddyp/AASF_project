import React from 'react'
import '../styles/Header.css'
import { useEffect, useState } from 'react'

const Header = () => {
    const [showFirst, setShowFirst] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setShowFirst(prev => !prev)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (

        <div className="header">
            <img
                src="/header1.png"
                className={`bg-image ${showFirst ? 'visible' : 'hidden'}`}
                alt="Header 1"
            />
            <img
                src="/header2.png"
                className={`bg-image ${!showFirst ? 'visible' : 'hidden'}`}
                alt="Header 2"
            />
            <div className="headertext">Explore the Infinity</div>
        </div>
    )
}
export default Header
