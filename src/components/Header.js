import React from 'react'
import { string } from 'prop-types'
import styled from 'styled-components'
import { HeaderBar } from '@dhis2/ui-widgets'

const StickyHeaderBar = styled(HeaderBar)`
    position: fixed;
    width: 100%;
    z-index: 1000;
    top: 0;
`

const Header = (appName) => (
    <StickyHeaderBar appName= { appName } />
)

Header.propTypes = {
    appName: string.isRequired,
}

export default Header