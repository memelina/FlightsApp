import React, { useEffect, useState } from 'react';
import { Modal, Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function AeroportList() {
    const [aeroporturi, setAeroporturi] = useState([]);
    const [numeNou, setNumeNou] = useState('');
    const [mesaj, setMesaj] = useState('');
    const [editId, setEditId] = useState(null);
    const [numeEditat, setNumeEditat] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        incarcaAeroporturi();
    }, []);

    const incarcaAeroporturi = () => {
        fetch('http://localhost:8080/api/aeroporturi')
            .then(response => response.json())
            .then(data => setAeroporturi(data))
            .catch(error => console.error('Eroare la fetch:', error));
    };

    const adaugaAeroport = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/aeroporturi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeAeroport: numeNou })
        }).then(async (response) => {
            const text = await response.text();
            setMesaj(text);
            setShowToast(true);
            if (response.ok) {
                setNumeNou('');
                incarcaAeroporturi();
            }
        });
    };

    const stergeAeroport = (id) => {
        fetch(`http://localhost:8080/api/aeroporturi/${id}`, {
            method: 'DELETE'
        }).then(async (response) => {
            const text = await response.text();
            setMesaj(text);
            setShowToast(true);
            if (response.ok) {
                incarcaAeroporturi();
            }
        });
    };

    const incepeEditarea = (aeroport) => {
        setEditId(aeroport.aeroportID);
        setNumeEditat(aeroport.numeAeroport);
        setShowModal(true);
    };

    const salveazaEditarea = (id) => {
        fetch(`http://localhost:8080/api/aeroporturi/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeAeroport: numeEditat })
        }).then(async (response) => {
            const text = await response.text();
            setMesaj(text);
            setShowToast(true);
            if (response.ok) {
                setShowModal(false);
                incarcaAeroporturi();
            }
        });
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">✈️ Plane Manager</NavLink>
        <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                    <NavLink
                        className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold text-warning' : '')}
                        to="/"
                    >
                        🛬 Airports
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold text-warning' : '')}
                        to="/flights"
                    >
                        🛫 Flights
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold text-warning' : '')}
                        to="/tickets"
                    >
                        🎫 Tickets
                    </NavLink>
                </li>
            </ul>
        </div>
    </div>
</nav>


            {/* HERO SECTION */}
            <div className="hero-section d-flex flex-column justify-content-center align-items-center text-white text-center">
                <h1 className="display-4 fw-bold">Bine ai venit la Plane Manager</h1>
                <p className="lead">Gestionează ușor aeroporturile tale preferate!</p>
            </div>

            <div className="container mt-5">
                <div className="card shadow-lg">
                    <div className="card-header bg-gradient text-white text-center" style={{ background: 'linear-gradient(90deg, #d0006f, #a200d3)' }}>
                        <h3 className="fw-bold">Administrează Aeroporturile</h3>
                    </div>
                    <div className="card-body">
                        {/* Formular de adăugare */}
                        <form className="mb-4" onSubmit={adaugaAeroport}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nume Aeroport Nou"
                                    value={numeNou}
                                    onChange={(e) => setNumeNou(e.target.value)}
                                    required
                                />
                                <button className="btn btn-success" type="submit">
                                    <i className="fas fa-plus"></i> Adaugă
                                </button>
                            </div>
                        </form>

                        {/* Tabel aeroporturi */}
                        <table className="table table-hover">
                            <thead className="table-success text-white">
                                <tr>
                                    <th>ID</th>
                                    <th>Nume Aeroport</th>
                                    <th>Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aeroporturi.map(aeroport => (
                                    <tr key={aeroport.aeroportID}>
                                        <td>{aeroport.aeroportID}</td>
                                        <td>{aeroport.numeAeroport}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => incepeEditarea(aeroport)}
                                            >
                                                <i className="fas fa-edit"></i> Editează
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => stergeAeroport(aeroport.aeroportID)}
                                            >
                                                <i className="fas fa-trash"></i> Șterge
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal pentru editare */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editează Aeroport</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        value={numeEditat}
                        onChange={(e) => setNumeEditat(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                        Anulează
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => salveazaEditarea(editId)}
                    >
                        <i className="fas fa-save"></i> Salvează
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Toast notification */}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    bg={mesaj.toLowerCase().includes('succes') ? 'success' : 'danger'}
                >
                    <Toast.Body className="text-white">{mesaj}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default AeroportList;
