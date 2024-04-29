<<<<<<< HEAD
import React from 'react';
import './Style.css';
import Feed from './Feed';

const Layout = (props) => {
    return (
        <>
            <div id='box'></div>
            <div id='boxright'></div>
            <div id='boxbottom'></div>
            <Feed />
            <main id="main" role="main">
                {props.children}
            </main>
        </>
    );
}

=======
import React from 'react';
import './Style.css';
import Feed from './Feed';

const Layout = (props) => {
    return (
        <>
            <div id='box'></div>
            <div id='boxright'></div>
            <div id='boxbottom'></div>
            <Feed />
            <main id="main" role="main">
                {props.children}
            </main>
        </>
    );
}

>>>>>>> fdfb8f3 (표정인식-음성텍스트변환 복구)
export default Layout;