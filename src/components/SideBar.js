import React from 'react'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import SettingsIcon from '@material-ui/icons/Settings'
import TuneIcon from '@material-ui/icons/Tune'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import StorageIcon from '@material-ui/icons/Storage'
import { Link } from 'react-router-dom'
import '../styles/SideBar.css'

const SideBar = () => {

    return (
        <div>
            <div className="sidebar">
                <div className="subcontent">
                    <div className="title-icon">
                        <ArrowUpwardIcon />
                        <h3>Export</h3>
                    </div>
                    <div className="title-icon">
                        <StorageIcon />
                        <Link to="/export">
                            <button className="button">Export data and metadata</button>
                        </Link>
                    </div>
                </div>
                <div className="subcontent">
                    <div className="title-icon">
                        <SettingsIcon />
                        <h3>Settings</h3>
                    </div>
                    <div className="title-icon">
                        <VpnKeyIcon />
                        <Link to="/credentials">
                            <button className="button">Import Credentials</button>
                        </Link> 
                    </div>
                    <div className="title-icon">
                        <TuneIcon />
                        <Link to="/settings">
                            <button className="button">Base Configuration Settings</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default SideBar