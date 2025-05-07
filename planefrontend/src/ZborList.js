import React, { useEffect, useState } from 'react';
import { Modal, Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function ZborList() {
    const [zboruri, setZboruri] = useState([]);
    const [aeroporturi, setAeroporturi] = useState([]);
    const [zborNou, setZborNou] = useState({
        oraDecolare: '',
        oraAterizare: '',
        numarLocuriMaxim: '',
        numarLocuriUtilizate: '',
        aeroportPlecareID: '',
        aeroportSosireID: ''
    });
    const [mesaj, setMesaj] = useState('');
    const [editId, setEditId] = useState(null);
    const [zborEditat, setZborEditat] = useState({ ...zborNou });
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [idCautat, setIdCautat] = useState('');
    const [zborGasit, setZborGasit] = useState(null);

    useEffect(() => {
        incarcaZboruri();
        incarcaAeroporturi();
    }, []);

    const incarcaZboruri = () => {
        fetch('http://localhost:8080/api/zboruri')
            .then(response => response.json())
            .then(data => setZboruri(data))
            .catch(error => console.error('Eroare la fetch zboruri:', error));
    };

    const incarcaAeroporturi = () => {
        fetch('http://localhost:8080/api/aeroporturi')
            .then(response => response.json())
            .then(data => setAeroporturi(data))
            .catch(error => console.error('Eroare la fetch aeroporturi:', error));
    };

    const adaugaZbor = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/zboruri', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(zborNou)
        }).then(async (response) => {
            const text = await response.text();
            setMesaj(text || 'Zbor adăugat cu succes.');
            setShowToast(true);
            if (response.ok) {
                setZborNou({
                    oraDecolare: '',
                    oraAterizare: '',
                    numarLocuriMaxim: '',
                    numarLocuriUtilizate: '',
                    aeroportPlecareID: '',
                    aeroportSosireID: ''
                });
                incarcaZboruri();
                setZborGasit(null);
            }
        });
    };

    const stergeZbor = (id) => {
        fetch(`http://localhost:8080/api/zboruri/${id}`, {
            method: 'DELETE'
        }).then(async (response) => {
            const text = await response.text();
            setMesaj(text);
            setShowToast(true);
            if (response.ok) {
                incarcaZboruri();
                setZborGasit(null);
            }
        });
    };

    const incepeEditarea = (zbor) => {
        setEditId(zbor.zborID);
        setZborEditat({ ...zbor });
        setShowModal(true);
    };

    const salveazaEditarea = (id) => {
        fetch(`http://localhost:8080/api/zboruri/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(zborEditat)
        }).then(async (response) => {
            const text = await response.text();
            setMesaj(text);
            setShowToast(true);
            if (response.ok) {
                setShowModal(false);
                incarcaZboruri();
                setZborGasit(null);
            }
        });
    };

    const cautaZbor = () => {
        if (!idCautat) return;
        fetch(`http://localhost:8080/api/zboruri/${idCautat}`)
            .then(response => {
                if (!response.ok) throw new Error('Zborul nu a fost găsit.');
                return response.json();
            })
            .then(data => {
                setZborGasit(data);
                setMesaj('Zbor găsit cu succes!');
                setShowToast(true);
            })
            .catch(() => {
                setZborGasit(null);
                setMesaj('Zborul nu a fost găsit.');
                setShowToast(true);
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
                <h1 className="display-4 fw-bold">Gestionează Zborurile</h1>
                <p className="lead">Administrează ușor toate zborurile disponibile!</p>
            </div>

            <div className="container mt-5">
                <div className="card shadow-lg">
                    <div className="card-header bg-gradient text-white text-center" style={{ background: 'linear-gradient(90deg, #d0006f, #a200d3)' }}>
                        <h3 className="fw-bold">Administrează Zborurile</h3>
                    </div>
                    <div className="card-body">
                        {/* Căutare */}
                        <div className="mb-4">
                            <h5 className="fw-bold">Caută un zbor după ID</h5>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Introdu ID-ul zborului"
                                    value={idCautat}
                                    onChange={(e) => setIdCautat(e.target.value)}
                                />
                                <button className="btn btn-success" onClick={cautaZbor}>
                                    <i className="fas fa-search"></i> Caută
                                </button>
                            </div>
                        </div>

                        {/* Rezultat căutare */}
                        {zborGasit && (
                            <div className="card mt-3 border-success">
                                <div className="card-header bg-success text-white">
                                    <h5 className="fw-bold">Rezultat căutare</h5>
                                </div>
                                <div className="card-body">
                                    <p><strong>ID:</strong> {zborGasit.zborID}</p>
                                    <p><strong>Ora Decolare:</strong> {zborGasit.oraDecolare}</p>
                                    <p><strong>Ora Aterizare:</strong> {zborGasit.oraAterizare}</p>
                                    <p><strong>Locuri Maxim:</strong> {zborGasit.numarLocuriMaxim}</p>
                                    <p><strong>Locuri Utilizate:</strong> {zborGasit.numarLocuriUtilizate}</p>
                                    <p><strong>Plecare:</strong> {
                                        aeroporturi.find(a => a.aeroportID === zborGasit.aeroportPlecareID)?.numeAeroport || 'N/A'
                                    }</p>
                                    <p><strong>Sosire:</strong> {
                                        aeroporturi.find(a => a.aeroportID === zborGasit.aeroportSosireID)?.numeAeroport || 'N/A'
                                    }</p>
                                </div>
                            </div>
                        )}

                        {/* Formular adăugare */}
                        <form className="my-4" onSubmit={adaugaZbor}>
                            <div className="row g-2">
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="Ora Decolare (ex: 10:00:00)"
                                        value={zborNou.oraDecolare}
                                        onChange={(e) => setZborNou({ ...zborNou, oraDecolare: e.target.value })}
                                        required />
                                </div>
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="Ora Aterizare (ex: 12:00:00)"
                                        value={zborNou.oraAterizare}
                                        onChange={(e) => setZborNou({ ...zborNou, oraAterizare: e.target.value })}
                                        required />
                                </div>
                                <div className="col">
                                    <input type="number" className="form-control" placeholder="Locuri Maxim"
                                        value={zborNou.numarLocuriMaxim}
                                        onChange={(e) => setZborNou({ ...zborNou, numarLocuriMaxim: e.target.value })}
                                        required />
                                </div>
                                <div className="col">
                                    <input type="number" className="form-control" placeholder="Locuri Utilizate"
                                        value={zborNou.numarLocuriUtilizate}
                                        onChange={(e) => setZborNou({ ...zborNou, numarLocuriUtilizate: e.target.value })}
                                        required />
                                </div>
                                <div className="col">
                                    <select className="form-select"
                                        value={zborNou.aeroportPlecareID}
                                        onChange={(e) => setZborNou({ ...zborNou, aeroportPlecareID: e.target.value })}
                                        required>
                                        <option value="">Selectează aeroport plecare</option>
                                        {aeroporturi.map(aeroport => (
                                            <option key={aeroport.aeroportID} value={aeroport.aeroportID}>
                                                {aeroport.numeAeroport}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col">
                                    <select className="form-select"
                                        value={zborNou.aeroportSosireID}
                                        onChange={(e) => setZborNou({ ...zborNou, aeroportSosireID: e.target.value })}
                                        required>
                                        <option value="">Selectează aeroport sosire</option>
                                        {aeroporturi.map(aeroport => (
                                            <option key={aeroport.aeroportID} value={aeroport.aeroportID}>
                                                {aeroport.numeAeroport}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto">
                                    <button className="btn btn-success" type="submit">
                                        <i className="fas fa-plus"></i> Adaugă
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Tabel zboruri */}
                        <table className="table table-hover">
                            <thead className="table-success text-white">
                                <tr>
                                    <th>ID</th>
                                    <th>Ora Decolare</th>
                                    <th>Ora Aterizare</th>
                                    <th>Locuri Maxim</th>
                                    <th>Locuri Utilizate</th>
                                    <th>Plecare</th>
                                    <th>Sosire</th>
                                    <th>Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zboruri.map(zbor => {
                                    const plecare = aeroporturi.find(a => a.aeroportID === zbor.aeroportPlecareID);
                                    const sosire = aeroporturi.find(a => a.aeroportID === zbor.aeroportSosireID);

                                    return (
                                        <tr key={zbor.zborID}>
                                            <td>{zbor.zborID}</td>
                                            <td>{zbor.oraDecolare}</td>
                                            <td>{zbor.oraAterizare}</td>
                                            <td>{zbor.numarLocuriMaxim}</td>
                                            <td>{zbor.numarLocuriUtilizate}</td>
                                            <td>{plecare ? plecare.numeAeroport : 'N/A'}</td>
                                            <td>{sosire ? sosire.numeAeroport : 'N/A'}</td>
                                            <td>
                                                <div className="d-flex">
                                                    <button className="btn btn-warning btn-sm me-2"
                                                        onClick={() => incepeEditarea(zbor)}>
                                                        <i className="fas fa-edit"></i> Editează
                                                    </button>
                                                    <button className="btn btn-danger btn-sm"
                                                        onClick={() => stergeZbor(zbor.zborID)}>
                                                        <i className="fas fa-trash"></i> Șterge
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal editare */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editează Zbor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row g-2">
                        <input type="text" className="form-control mb-2" placeholder="Ora Decolare"
                            value={zborEditat.oraDecolare}
                            onChange={(e) => setZborEditat({ ...zborEditat, oraDecolare: e.target.value })} />
                        <input type="text" className="form-control mb-2" placeholder="Ora Aterizare"
                            value={zborEditat.oraAterizare}
                            onChange={(e) => setZborEditat({ ...zborEditat, oraAterizare: e.target.value })} />
                        <input type="number" className="form-control mb-2" placeholder="Locuri Maxim"
                            value={zborEditat.numarLocuriMaxim}
                            onChange={(e) => setZborEditat({ ...zborEditat, numarLocuriMaxim: e.target.value })} />
                        <input type="number" className="form-control mb-2" placeholder="Locuri Utilizate"
                            value={zborEditat.numarLocuriUtilizate}
                            onChange={(e) => setZborEditat({ ...zborEditat, numarLocuriUtilizate: e.target.value })} />
                        <select className="form-select mb-2"
                            value={zborEditat.aeroportPlecareID}
                            onChange={(e) => setZborEditat({ ...zborEditat, aeroportPlecareID: e.target.value })}
                            required>
                            <option value="">Selectează aeroport plecare</option>
                            {aeroporturi.map(aeroport => (
                                <option key={aeroport.aeroportID} value={aeroport.aeroportID}>
                                    {aeroport.numeAeroport}
                                </option>
                            ))}
                        </select>
                        <select className="form-select mb-2"
                            value={zborEditat.aeroportSosireID}
                            onChange={(e) => setZborEditat({ ...zborEditat, aeroportSosireID: e.target.value })}
                            required>
                            <option value="">Selectează aeroport sosire</option>
                            {aeroporturi.map(aeroport => (
                                <option key={aeroport.aeroportID} value={aeroport.aeroportID}>
                                    {aeroport.numeAeroport}
                                </option>
                            ))}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                        Anulează
                    </button>
                    <button className="btn btn-success"
                        onClick={() => salveazaEditarea(editId)}>
                        <i className="fas fa-save"></i> Salvează
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Toast notificare */}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide
                    bg={mesaj.toLowerCase().includes('succes') ? 'success' : 'danger'}>
                    <Toast.Body className="text-white">{mesaj}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default ZborList;
