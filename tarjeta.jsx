function Tarjeta({ children, title }) {
    return (
        <div className="card">
            {title && <h3>{title}</h3>}

            <div className="card-content">
                {children}
            </div>
        </div>
    );
}

export default Tarjeta;