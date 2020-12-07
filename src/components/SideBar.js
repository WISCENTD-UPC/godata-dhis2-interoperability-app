import React from 'react'
import '../styles/SideBar.css'

const SideBar = () => {

    return (
        <div>
            <div className="sidebar">
                <h3>Settings</h3>
                <a href="/credentials">
                    <button className="button">Import Credentials</button>
                </a>
                <a href="/settings">
                    <button className="button">Base Configuration Settings</button>
                </a>
            </div>
        </div>
    )
    
}

export default SideBar