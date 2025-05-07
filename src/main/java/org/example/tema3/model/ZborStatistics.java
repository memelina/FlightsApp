package org.example.tema3.model;

public class ZborStatistics {
    private String ruta;
    private int numarBilete;
    private int zborID; // Added for potential linking

    public ZborStatistics(String ruta, int numarBilete) {
        this.ruta = ruta;
        this.numarBilete = numarBilete;
    }

    // Getters and Setters
    public String getRuta() {
        return ruta;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }

    public int getNumarBilete() {
        return numarBilete;
    }

    public void setNumarBilete(int numarBilete) {
        this.numarBilete = numarBilete;
    }

    public int getZborID() {
        return zborID;
    }

    public void setZborID(int zborID) {
        this.zborID = zborID;
    }
}