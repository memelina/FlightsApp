package org.example.tema3.model.viewmodel;

import org.example.tema3.model.Observable;
import org.example.tema3.model.Zbor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZborViewModel extends Observable {

    private final JdbcTemplate jdbcTemplate;

    public ZborViewModel(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // CREATE
    public void adaugaZbor(Zbor zbor) {
        String sql = "INSERT INTO Zbor (oraDecolare, oraAterizare, numarLocuriMaxim, numarLocuriUtilizate, aeroportPlecareID, aeroportSosireID) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, zbor.getOraDecolare(), zbor.getOraAterizare(),
                zbor.getNumarLocuriMaxim(), zbor.getNumarLocuriUtilizate(),
                zbor.getAeroportPlecareID(), zbor.getAeroportSosireID());
        notifyObservers();
    }
    public Zbor gasesteZborDupaId(int id) {
        String sql = "SELECT * FROM Zbor WHERE zborID = ?";
        List<Zbor> rezultate = jdbcTemplate.query(sql, (rs, rowNum) ->
                        new Zbor(
                                rs.getInt("zborID"),
                                rs.getString("oraDecolare"),
                                rs.getString("oraAterizare"),
                                rs.getInt("numarLocuriMaxim"),
                                rs.getInt("numarLocuriUtilizate"),
                                rs.getInt("aeroportPlecareID"),
                                rs.getInt("aeroportSosireID")
                        ),
                id
        );

        return rezultate.isEmpty() ? null : rezultate.get(0);
    }

    // READ
    public List<Zbor> getZboruri() {
        String sql = "SELECT * FROM Zbor ORDER BY zborID ASC";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Zbor(
                        rs.getInt("zborID"),
                        rs.getString("oraDecolare"),
                        rs.getString("oraAterizare"),
                        rs.getInt("numarLocuriMaxim"),
                        rs.getInt("numarLocuriUtilizate"),
                        rs.getInt("aeroportPlecareID"),
                        rs.getInt("aeroportSosireID")
                )
        );
    }


    // UPDATE
    public boolean modificaZbor(int id, Zbor zborNou) {
        String sql = "UPDATE Zbor SET oraDecolare = ?, oraAterizare = ?, numarLocuriMaxim = ?, numarLocuriUtilizate = ?, aeroportPlecareID = ?, aeroportSosireID = ? WHERE zborID = ?";
        int rowsUpdated = jdbcTemplate.update(sql,
                zborNou.getOraDecolare(),
                zborNou.getOraAterizare(),
                zborNou.getNumarLocuriMaxim(),
                zborNou.getNumarLocuriUtilizate(),
                zborNou.getAeroportPlecareID(),
                zborNou.getAeroportSosireID(),
                id);
        if (rowsUpdated > 0) {
            notifyObservers();
            return true;
        }
        return false;
    }

    // DELETE
    public boolean stergeZbor(int id) {
        String sql = "DELETE FROM Zbor WHERE zborID = ?";
        int rowsDeleted = jdbcTemplate.update(sql, id);
        if (rowsDeleted > 0) {
            notifyObservers();
            return true;
        }
        return false;
    }
}
