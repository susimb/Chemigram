function Navbar({ user }) {
    return (
        <nav className="navbar">

            <div className="navbar-logo">
                🧪 Potion Lab
            </div>

            <div className="navbar-links">
                <a href="/">Inicio</a>
                <a href="/guilds">Gremios</a>
                <a href="/formulas">Fórmulas</a>
                <a href="/ranking">Ranking</a>
            </div>

            <div className="navbar-user">
                {user && (
                    <span>
                        {user.fullName}
                    </span>
                )}
            </div>

        </nav>
    );
}

export default Navbar;