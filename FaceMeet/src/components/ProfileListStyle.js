import { Avatar, Typography } from '@mui/material';
import logo from '../dog.svg';
import './Style.css';

function ProfileListStyle({ username }) {
    return (
        <div>
            <Avatar src = {logo} alt = {username} className='custom-avatar'
            sx={{
            width: '5rem',
            height: '5rem',
            borderRadius: '15%',
            '> img': {
                padding: '1.5px',
            },
            }}/>

            <Typography variant="body2" noWrap align='center' sx={{width: '56px'}}> {username}</Typography>
        </div>
    );

}
export default ProfileListStyle;