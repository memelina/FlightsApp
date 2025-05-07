package org.example.tema3.model;

public class Aeroport {
    private int aeroportID;
    private String numeAeroport;

    public Aeroport(int aeroportID, String numeAeroport) {
        this.aeroportID = aeroportID;
        this.numeAeroport = numeAeroport;
    }
    public Aeroport() {
        // constructor gol pentru JSON (obligatoriu pentru Jackson)
    }
    public Aeroport(String numeAeroport) {
        this.numeAeroport = numeAeroport;
    }

    public int getAeroportID() {
        return aeroportID;
    }

    public void setAeroportID(int aeroportID) {
        this.aeroportID = aeroportID;
    }

    public String getNumeAeroport() {
        return numeAeroport;
    }

    public void setNumeAeroport(String numeAeroport) {
        this.numeAeroport = numeAeroport;
    }
}
