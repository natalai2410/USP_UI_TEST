import './Header.css';


const Header = ({authOn, user, userRole, description}) => {
    return (
        <header className="header">
            <div className=  {`header__content ${authOn ? 'header__content_active' : ''}`}>
                <div className={`header__user ${authOn ? 'header__user_active' : ''}`}>
                    <div className="user__role">{userRole}</div>
                    <div className="user__name"> {user}</div>
                </div>
                <div className="header__title">{description}</div>
            </div>
        </header>
    );
};

export default Header;
