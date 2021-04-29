import React from 'react'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import SettingsIcon from '@material-ui/icons/Settings'
import TuneIcon from '@material-ui/icons/Tune'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import StorageIcon from '@material-ui/icons/Storage'
import { Link } from 'react-router-dom'
import '../styles/SideBar.css'

const SideBar = () => {

    return (
        <div className="sidebar">
            <div className="subcontent">
                <div className="title-icon">
                    <ArrowUpwardIcon />
                    <Link to="/export">
                        <button className="button">
                            <h3>Export to Go.Data</h3>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="subcontent">
                <div className="title-icon">
                    <ArrowDownwardIcon />   
                    <Link to="/import">
                        <button className="button">
                        <h3>Import from Go.Data</h3>
                        </button>
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
    )
    
}

export default SideBar