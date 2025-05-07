package org.example.tema3.model.viewmodel;

import org.example.tema3.model.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BiletViewModel extends Observable {

    private final JdbcTemplate jdbcTemplate;

    public BiletViewModel(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // CREATE
    public void adaugaBilet(Bilet bilet) {
        // 1️⃣ Căutăm zborul ca să obținem aeroporturile.
        String findZborSql = "SELECT aeroportPlecareID, aeroportSosireID FROM Zbor WHERE zborID = ?";
        Map<String, Object> zbor = jdbcTemplate.queryForMap(findZborSql, bilet.getZborID());

        int aeroportPlecareID = (int) zbor.get("aeroportPlecareID");
        int aeroportSosireID = (int) zbor.get("aeroportSosireID");

        // ✅ Acum INSERĂM și dataCalatorie:
        String insertSql = "INSERT INTO Bilet (numePasager, pret, zborID, dataCalatorie, aeroportDecolareID, aeroportAterizareID) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
                bilet.getNumePasager(),
                bilet.getPret(),
                bilet.getZborID(),
                bilet.getDataCalatorie(),
                aeroportPlecareID,
                aeroportSosireID
        );

        notifyObservers();
    }


    // READ
    public List<Bilet> getBilete() {
        String sql = "SELECT * FROM Bilet ORDER BY biletID ASC";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Bilet(
                        rs.getInt("biletID"),
                        rs.getInt("zborID"),
                        rs.getString("dataCalatorie"), // 👈 OBLIGATORIU SĂ FIE AICI
                        rs.getInt("aeroportDecolareID"),
                        rs.getInt("aeroportAterizareID"),
                        rs.getInt("numarLoc"),
                        rs.getString("numePasager"),
                        rs.getInt("pret")
                )
        );
    }
    public List<Bilet> getBiletePentruZbor(int zborID) {
        String sql = "SELECT * FROM Bilet WHERE zborID = ?";
        return jdbcTemplate.query(sql, new Object[]{zborID}, (rs, rowNum) -> new Bilet(
                rs.getInt("biletID"),
                rs.getInt("zborID"),
                rs.getString("dataCalatorie"),
                rs.getInt("aeroportDecolareID"),
                rs.getInt("aeroportAterizareID"),
                rs.getInt("numarLoc"),
                rs.getString("numePasager"),
                rs.getInt("pret")
        ));
    }
    public List<BiletStatistics> getStatisticiBilete() {
        String sql = """
            SELECT b.zborID, COUNT(*) as numarBilete, 
                   ap.numeAeroport as plecare, aso.numeAeroport as sosire
            FROM Bilet b
            JOIN Zbor z ON b.zborID = z.zborID
            JOIN Aeroport ap ON z.aeroportPlecareID = ap.aeroportID
            JOIN Aeroport aso ON z.aeroportSosireID = aso.aeroportID
            GROUP BY b.zborID, ap.numeAeroport, aso.numeAeroport
            ORDER BY numarBilete DESC
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            BiletStatistics stat = new BiletStatistics(
                    rs.getInt("zborID"),
                    rs.getInt("numarBilete")
            );
            stat.setRuta(rs.getString("plecare") + " → " + rs.getString("sosire"));
            return stat;
        });
    }

    public List<ZborStatistics> getStatisticiZboruri() {
        String sql = """
            SELECT ap.numeAeroport as plecare, aso.numeAeroport as sosire, 
                   COUNT(*) as numarBilete, MIN(b.zborID) as zborID
            FROM Bilet b
            JOIN Zbor z ON b.zborID = z.zborID
            JOIN Aeroport ap ON z.aeroportPlecareID = ap.aeroportID
            JOIN Aeroport aso ON z.aeroportSosireID = aso.aeroportID
            GROUP BY ap.numeAeroport, aso.numeAeroport
            ORDER BY numarBilete DESC
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ZborStatistics stat = new ZborStatistics(
                    rs.getString("plecare") + " → " + rs.getString("sosire"),
                    rs.getInt("numarBilete")
            );
            stat.setZborID(rs.getInt("zborID"));
            return stat;
        });
    }

    public Map<String, Object> getStatisticiVenit() {
        Map<String, Object> result = new HashMap<>();

        // Total income
        String totalSql = "SELECT SUM(pret) as total FROM Bilet";
        Double venitTotal = jdbcTemplate.queryForObject(totalSql, Double.class);
        result.put("venitTotal", venitTotal != null ? venitTotal : 0);

        // Income per flight
        String venitZborSql = """
            SELECT z.zborID, SUM(b.pret) as venit, 
                   ap.numeAeroport as plecare, aso.numeAeroport as sosire
            FROM Bilet b
            JOIN Zbor z ON b.zborID = z.zborID
            JOIN Aeroport ap ON z.aeroportPlecareID = ap.aeroportID
            JOIN Aeroport aso ON z.aeroportSosireID = aso.aeroportID
            GROUP BY z.zborID, ap.numeAeroport, aso.numeAeroport
            ORDER BY venit DESC
            """;

        List<Map<String, Object>> venitPeZbor = jdbcTemplate.queryForList(venitZborSql);
        result.put("venitPeZbor", venitPeZbor);

        return result;
    }
    // FIND by ID
    public Bilet gasesteBiletDupaId(int id) {
        String sql = "SELECT * FROM Bilet WHERE biletID = ?";
        List<Bilet> rezultate = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Bilet(
                        rs.getInt("biletID"),
                        rs.getInt("zborID"),
                        rs.getString("dataCalatorie"),
                        rs.getInt("aeroportDecolareID"),
                        rs.getInt("aeroportAterizareID"),
                        rs.getInt("numarLoc"),
                        rs.getString("numePasager"),
                        rs.getInt("pret")
                ), id);
        return rezultate.isEmpty() ? null : rezultate.get(0);
    }

    // UPDATE
    // UPDATE
    public boolean modificaBilet(int id, Bilet biletNou) {
        // 🔥 Căutăm zborul pentru aeroporturi automat (cum ai la adăugare)
        String findZborSql = "SELECT aeroportPlecareID, aeroportSosireID FROM Zbor WHERE zborID = ?";
        Map<String, Object> zbor = jdbcTemplate.queryForMap(findZborSql, biletNou.getZborID());

        int aeroportPlecareID = (int) zbor.get("aeroportPlecareID");
        int aeroportSosireID = (int) zbor.get("aeroportSosireID");

        // ✅ Update cu aeroporturile AUTOMAT din zbor
        String sql = "UPDATE Bilet SET zborID = ?, dataCalatorie = ?, aeroportDecolareID = ?, aeroportAterizareID = ?, numarLoc = ?, numePasager = ?, pret = ? WHERE biletID = ?";
        int rowsUpdated = jdbcTemplate.update(sql,
                biletNou.getZborID(),
                biletNou.getDataCalatorie(),
                aeroportPlecareID, // nu din frontend
                aeroportSosireID,  // nu din frontend
                biletNou.getNumarLoc(),
                biletNou.getNumePasager(),
                biletNou.getPret(),
                id
        );
        if (rowsUpdated > 0) {
            notifyObservers();
            return true;
        }
        return false;
    }
    public List<Bilet> filtreazaBilete(Integer zborID, String dataCalatorie, Integer aeroportAterizareID) {
        String sql = "SELECT * FROM Bilet WHERE 1=1";
        List<Object> params = new ArrayList<>();

        if (zborID != null) {
            sql += " AND zborID = ?";
            params.add(zborID);
        }
        if (dataCalatorie != null && !dataCalatorie.isEmpty()) {
            sql += " AND dataCalatorie = ?";
            params.add(dataCalatorie);
        }
        if (aeroportAterizareID != null) {
            sql += " AND aeroportAterizareID = ?";
            params.add(aeroportAterizareID);
        }

        return jdbcTemplate.query(sql, params.toArray(), (rs, rowNum) -> new Bilet(
                rs.getInt("biletID"),
                rs.getInt("zborID"),
                rs.getString("dataCalatorie"),
                rs.getInt("aeroportDecolareID"),
                rs.getInt("aeroportAterizareID"),
                rs.getInt("numarLoc"),
                rs.getString("numePasager"),
                rs.getInt("pret")
        ));
    }

    // DELETE
    public boolean stergeBilet(int id) {
        String sql = "DELETE FROM Bilet WHERE biletID = ?";
        int rowsDeleted = jdbcTemplate.update(sql, id);
        if (rowsDeleted > 0) {
            notifyObservers();
            return true;
        }
        return false;
    }
}
