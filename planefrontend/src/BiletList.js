import React, { useEffect, useState } from 'react';
import { Modal, Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function BiletList() {
    const [bilete, setBilete] = useState([]);
    const [zboruri, setZboruri] = useState([]);
    const [aeroporturi, setAeroporturi] = useState([]);
    const [zborSelectatPentruExport, setZborSelectatPentruExport] = useState(null);
    const [statisticiBilete, setStatisticiBilete] = useState([]);
    const [statisticiZboruri, setStatisticiZboruri] = useState([]);
    const [statisticiVenit, setStatisticiVenit] = useState({});

    const [biletNou, setBiletNou] = useState({
        numePasager: '',
        pret: '',
        zborID: '',
        dataCalatorie: '',
        aeroportPlecare: '',
        aeroportSosire: ''
    });

    const [mesaj, setMesaj] = useState('');
    const [editId, setEditId] = useState(null);
    const [biletEditat, setBiletEditat] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [zborFiltru, setZborFiltru] = useState('');
    const [dataFiltru, setDataFiltru] = useState('');
    const [aeroportAterizareFiltru, setAeroportAterizareFiltru] = useState('');
    
    // Culori pentru grafice
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    useEffect(() => {
        incarcaBilete();
        incarcaZboruri();
        incarcaAeroporturi();
        incarcaStatistici();
    }, []);

    const incarcaBilete = () => {
        fetch('http://localhost:8080/api/bilete')
            .then(response => response.json())
            .then(data => setBilete(data))
            .catch(error => console.error('Eroare la fetch bilete:', error));
    };

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

    const incarcaStatistici = () => {
        // Statistici bilete pe zboruri
        fetch('http://localhost:8080/api/bilete/statistici/bilete')
            .then(response => response.json())
            .then(data => setStatisticiBilete(data));

        // Statistici zboruri populare
        fetch('http://localhost:8080/api/bilete/statistici/zboruri')
            .then(response => response.json())
            .then(data => setStatisticiZboruri(data));

        // Statistici venituri
        fetch('http://localhost:8080/api/bilete/statistici/venit')
            .then(response => response.json())
            .then(data => setStatisticiVenit(data));
    };

    const adaugaBilet = (e) => {
        e.preventDefault();
        const biletDeTrimis = {
            numePasager: biletNou.numePasager,
            pret: biletNou.pret,
            zborID: biletNou.zborID,
            dataCalatorie: biletNou.dataCalatorie
        };
        
        fetch('http://localhost:8080/api/bilete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(biletDeTrimis)
        }).then(async (response) => {
            const text = await response.text();
            setMesaj(text || 'Bilet adăugat cu succes.');
            setShowToast(true);
            if (response.ok) {
                setBiletNou({
                    numePasager: '',
                    pret: '',
                    zborID: '',
                    dataCalatorie: '',
                    aeroportPlecare: '',
                    aeroportSosire: ''
                });
                incarcaBilete();
                incarcaStatistici();
            }
        });
    };

    const stergeBilet = (id) => {
        fetch(`http://localhost:8080/api/bilete/${id}`, {
            method: 'DELETE'
        }).then(async (response) => {
            const text = await response.text();
            setMesaj(text);
            setShowToast(true);
            if (response.ok) {
                incarcaBilete();
                incarcaStatistici();
            }
        });
    };

    const incepeEditarea = (bilet) => {
        const zbor = zboruri.find(z => z.zborID === bilet.zborID);
        const plecare = aeroporturi.find(a => a.aeroportID === zbor?.aeroportPlecareID);
        const sosire = aeroporturi.find(a => a.aeroportID === zbor?.aeroportSosireID);

        setEditId(bilet.biletID);
        setBiletEditat({
            ...bilet,
            aeroportPlecare: plecare ? plecare.numeAeroport : '',
            aeroportSosire: sosire ? sosire.numeAeroport : ''
        });
        setShowModal(true);
    };

    const salveazaEditarea = (id) => {
        const biletDeTrimis = {
            numePasager: biletEditat.numePasager,
            pret: biletEditat.pret,
            zborID: biletEditat.zborID,
            dataCalatorie: biletEditat.dataCalatorie
        };

        fetch(`http://localhost:8080/api/bilete/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(biletDeTrimis)
        }).then(async (response) => {
            const text = await response.text();
            setMesaj(text);
            setShowToast(true);
            if (response.ok) {
                setShowModal(false);
                incarcaBilete();
                incarcaStatistici();
            }
        });
    };

    const filtreazaBilete = () => {
        const params = new URLSearchParams();
        if (zborFiltru) {
            params.append('zborID', zborFiltru);
            setZborSelectatPentruExport(zborFiltru);
        }
        if (dataFiltru) params.append('dataCalatorie', dataFiltru);
        if (aeroportAterizareFiltru) params.append('aeroportAterizareID', aeroportAterizareFiltru);
    
        fetch(`http://localhost:8080/api/bilete/filtru?${params.toString()}`)
            .then(response => response.json())
            .then(data => setBilete(data));
    };
    
    const handleZborSelect = (zborID) => {
        setBiletNou(prev => ({ ...prev, zborID }));
        setZborSelectatPentruExport(zborID);

        const zbor = zboruri.find(z => z.zborID === parseInt(zborID));

        if (zbor) {
            const plecare = aeroporturi.find(a => a.aeroportID === zbor.aeroportPlecareID);
            const sosire = aeroporturi.find(a => a.aeroportID === zbor.aeroportSosireID);

            setBiletNou(prev => ({
                ...prev,
                aeroportPlecare: plecare ? plecare.numeAeroport : '',
                aeroportSosire: sosire ? sosire.numeAeroport : ''
            }));
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(90deg, #d0006f, #a200d3)' }}>
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
                <h1 className="display-4 fw-bold">Gestionează Biletele</h1>
                <p className="lead">Adaugă și administrează biletele pasagerilor cu ușurință!</p>
            </div>

            {/* Secțiune Grafice */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Statistici Bilete și Zboruri</h2>
                
                <div className="row">
                    {/* Grafic 1: Bilete vândute pe zboruri */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h5>Bilete vândute pe zboruri</h5>
                            </div>
                            <div className="card-body">
                                <div style={{ height: '400px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={statisticiBilete}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="zborID" />
                                            <YAxis />
                                            <Tooltip 
                                                formatter={(value) => [`${value} bilete`, 'Număr bilete']}
                                                labelFormatter={(label) => `Zbor #${label}`}
                                            />
                                            <Legend />
                                            <Bar 
                                                dataKey="numarBilete" 
                                                fill="#8884d8" 
                                                name="Bilete vândute"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grafic 2: Distribuție bilete pe zboruri */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow">
                            <div className="card-header bg-success text-white">
                                <h5>Distribuția bilete pe zboruri</h5>
                            </div>
                            <div className="card-body">
                                <div style={{ height: '400px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statisticiBilete}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="numarBilete"
                                                nameKey="ruta"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {statisticiBilete.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => [`${value} bilete`, 'Număr bilete']}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafic 3: Cele mai populare zboruri */}
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card shadow">
                            <div className="card-header bg-info text-white">
                                <h5>Cele mai populare rute</h5>
                            </div>
                            <div className="card-body">
                                <div style={{ height: '500px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={statisticiZboruri}
                                            layout="vertical"
                                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis 
                                                dataKey="ruta" 
                                                type="category" 
                                                width={150} 
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip 
                                                formatter={(value) => [`${value} bilete`, 'Număr bilete']}
                                            />
                                            <Legend />
                                            <Bar 
                                                dataKey="numarBilete" 
                                                fill="#ffc658" 
                                                name="Bilete vândute"
                                                radius={[0, 4, 4, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafic 4: Venituri */}
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-header bg-warning text-white">
                                <h5>Venituri totale: {statisticiVenit.venitTotal?.toFixed(2)} RON</h5>
                            </div>
                            <div className="card-body">
                                <div style={{ height: '500px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={statisticiVenit.venitPeZbor || []}
                                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="zborID" 
                                                label={{ value: 'ID Zbor', position: 'insideBottomRight', offset: -5 }}
                                            />
                                            <YAxis 
                                                label={{ value: 'RON', angle: -90, position: 'insideLeft' }}
                                            />
                                            <Tooltip 
                                                formatter={(value) => [`${value} RON`, 'Venit']}
                                                labelFormatter={(label) => `Zbor #${label}`}
                                            />
                                            <Legend />
                                            <Bar 
                                                dataKey="venit" 
                                                fill="#00C49F" 
                                                name="Venit (RON)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secțiunea existentă pentru administrare bilete */}
            <div className="container mt-5">
                <div className="card shadow-lg">
                    <div className="card-header bg-gradient text-white text-center" style={{ background: 'linear-gradient(90deg, #d0006f, #a200d3)' }}>
                        <h3 className="fw-bold">Administrează Biletele</h3>
                    </div>
                    <div className="card-body">
                        {/* Formular adăugare */}
                        <form className="mb-4" onSubmit={adaugaBilet}>
                            <div className="row g-2">
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="Nume Pasager"
                                        value={biletNou.numePasager}
                                        onChange={(e) => setBiletNou({ ...biletNou, numePasager: e.target.value })}
                                        required />
                                </div>
                                <div className="col">
                                    <input type="number" className="form-control" placeholder="Preț"
                                        value={biletNou.pret}
                                        onChange={(e) => setBiletNou({ ...biletNou, pret: e.target.value })}
                                        required />
                                </div>
                                <div className="col">
                                    <input
                                        type="date"
                                        className="form-control"
                                        placeholder="Data Călătoriei"
                                        value={biletNou.dataCalatorie}
                                        onChange={(e) => setBiletNou({ ...biletNou, dataCalatorie: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col">
                                    <select className="form-select"
                                        value={biletNou.zborID}
                                        onChange={(e) => handleZborSelect(e.target.value)}
                                        required>
                                        <option value="">Selectează zbor</option>
                                        {zboruri.map(zbor => (
                                            <option key={zbor.zborID} value={zbor.zborID}>
                                                {`#${zbor.zborID} - ${zbor.oraDecolare} ➔ ${zbor.oraAterizare}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col">
                                    <input type="text" className="form-control" value={biletNou.aeroportPlecare} disabled placeholder="Aeroport Plecare" />
                                </div>
                                <div className="col">
                                    <input type="text" className="form-control" value={biletNou.aeroportSosire} disabled placeholder="Aeroport Sosire" />
                                </div>
                                <div className="col-auto">
                                    <button className="btn btn-success" type="submit">
                                        <i className="fas fa-plus"></i> Adaugă
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Export buttons */}
                        {(zborSelectatPentruExport || zborFiltru) && (
                            <div className="mb-3">
                                <button
                                    className="btn btn-outline-primary me-2"
                                    onClick={() =>
                                        window.open(`http://localhost:8080/api/bilete/export/csv/${zborSelectatPentruExport || zborFiltru}`, '_blank')
                                    }
                                >
                                    <i className="fas fa-file-csv"></i> Export CSV
                                </button>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        window.open(`http://localhost:8080/api/bilete/export/doc/${zborSelectatPentruExport || zborFiltru}`, '_blank')
                                    }
                                >
                                    <i className="fas fa-file-word"></i> Export DOC
                                </button>
                            </div>
                        )}

                        {/* Filtrare bilete */}
                        <div className="card my-4">
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">Filtrează biletele</h5>
                                <div className="row g-2">
                                    <div className="col">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Număr Zbor"
                                            value={zborFiltru}
                                            onChange={(e) => setZborFiltru(e.target.value)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={dataFiltru}
                                            onChange={(e) => setDataFiltru(e.target.value)}
                                        />
                                    </div>
                                    <div className="col">
                                        <select
                                            className="form-select"
                                            value={aeroportAterizareFiltru}
                                            onChange={(e) => setAeroportAterizareFiltru(e.target.value)}
                                        >
                                            <option value="">Toate aeroporturile</option>
                                            {aeroporturi.map((a) => (
                                                <option key={a.aeroportID} value={a.aeroportID}>
                                                    {a.numeAeroport}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn btn-success" onClick={filtreazaBilete}>
                                            <i className="fas fa-filter"></i> Filtrează
                                        </button>
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn btn-success" onClick={incarcaBilete}>
                                            <i className="fas fa-filter"></i> Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabel bilete */}
                        <table className="table table-hover">
                            <thead className="table-success text-white">
                                <tr>
                                    <th>ID</th>
                                    <th>Nume Pasager</th>
                                    <th>Preț</th>
                                    <th>Zbor ID</th>
                                    <th>Data Călătoriei</th>
                                    <th>Aeroport Plecare</th>
                                    <th>Aeroport Sosire</th>
                                    <th>Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bilete.map(bilet => {
                                    const zbor = zboruri.find(z => z.zborID === bilet.zborID);
                                    const plecare = aeroporturi.find(a => a.aeroportID === zbor?.aeroportPlecareID);
                                    const sosire = aeroporturi.find(a => a.aeroportID === zbor?.aeroportSosireID);

                                    return (
                                        <tr key={bilet.biletID}>
                                            <td>{bilet.biletID}</td>
                                            <td>{bilet.numePasager}</td>
                                            <td>{bilet.pret}</td>
                                            <td>{bilet.zborID}</td>
                                            <td>{bilet.dataCalatorie}</td>
                                            <td>{plecare ? plecare.numeAeroport : 'N/A'}</td>
                                            <td>{sosire ? sosire.numeAeroport : 'N/A'}</td>
                                            <td>
                                                <button className="btn btn-warning btn-sm me-2"
                                                    onClick={() => incepeEditarea(bilet)}>
                                                    <i className="fas fa-edit"></i> Editează
                                                </button>
                                                <button className="btn btn-danger btn-sm"
                                                    onClick={() => stergeBilet(bilet.biletID)}>
                                                    <i className="fas fa-trash"></i> Șterge
                                                </button>
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
                    <Modal.Title>Editează Bilet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" className="form-control mb-2" placeholder="Nume Pasager"
                        value={biletEditat.numePasager}
                        onChange={(e) => setBiletEditat({ ...biletEditat, numePasager: e.target.value })} />
                    <input type="number" className="form-control mb-2" placeholder="Preț"
                        value={biletEditat.pret}
                        onChange={(e) => setBiletEditat({ ...biletEditat, pret: e.target.value })} />
                    <input type="date" className="form-control mb-2" placeholder="Data Călătoriei"
                        value={biletEditat.dataCalatorie}
                        onChange={(e) => setBiletEditat({ ...biletEditat, dataCalatorie: e.target.value })}
                    />
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

export default BiletList;