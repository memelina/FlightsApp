package org.example.tema3.model;

public class BiletStatistics {
    private int zborID;
    private int numarBilete;
    private String ruta; // Added for better frontend display

    public BiletStatistics(int zborID, int numarBilete) {
        this.zborID = zborID;
        this.numarBilete = numarBilete;
    }

    // Getters and Setters
    public int getZborID() {
        return zborID;
    }

    public void setZborID(int zborID) {
        this.zborID = zborID;
    }

    public int getNumarBilete() {
        return numarBilete;
    }

    public void setNumarBilete(int numarBilete) {
        this.numarBilete = numarBilete;
    }

    public String getRuta() {
        return ruta;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }
}