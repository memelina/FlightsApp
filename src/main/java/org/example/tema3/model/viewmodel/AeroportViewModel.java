package org.example.tema3.model.viewmodel;

import org.example.tema3.model.Observable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.example.tema3.model.Aeroport;


import java.util.List;

@Service
public class AeroportViewModel extends Observable {

    private final JdbcTemplate jdbcTemplate;

    public AeroportViewModel(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // CREATE
    public void adaugaAeroport(String numeAeroport) {
        String sql = "INSERT INTO Aeroport (numeAeroport) VALUES (?)";
        jdbcTemplate.update(sql, numeAeroport);
        notifyObservers();
    }

    // READ
    public List<Aeroport> getAeroporturi() {
        String sql = "SELECT * FROM Aeroport";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Aeroport(rs.getInt("aeroportID"), rs.getString("numeAeroport"))
        );
    }

    // UPDATE
    public boolean modificaAeroport(int id, String numeNou) {
        String sql = "UPDATE Aeroport SET numeAeroport = ? WHERE aeroportID = ?";
        int rowsUpdated = jdbcTemplate.update(sql, numeNou, id);
        if (rowsUpdated > 0) {
            notifyObservers();
            return true;
        }
        return false;
    }

    // DELETE
    public boolean stergeAeroport(int id) {
        String countSql = "SELECT COUNT(*) FROM Zbor WHERE aeroportPlecareID = ?";
        Integer count = jdbcTemplate.queryForObject(countSql, Integer.class, id);

        if (count != null && count > 0) {
            System.out.println("Nu poți șterge aeroportul, există zboruri asociate.");
            return false;
        }

        String sql = "DELETE FROM Aeroport WHERE aeroportID = ?";
        int rowsDeleted = jdbcTemplate.update(sql, id);
        if (rowsDeleted > 0) {
            notifyObservers();
            return true;
        }
        return false;
    }

}
