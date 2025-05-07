package org.example.tema3.model;

public class Zbor {
    private int zborID;
    private String oraDecolare;
    private String oraAterizare;
    private int numarLocuriMaxim;
    private int numarLocuriUtilizate;
    private int aeroportPlecareID;
    private int aeroportSosireID;

    public Zbor(int zborID, String oraDecolare, String oraAterizare,
                int numarLocuriMaxim, int numarLocuriUtilizate,
                int aeroportPlecareID, int aeroportSosireID) {
        this.zborID = zborID;
        this.oraDecolare = oraDecolare;
        this.oraAterizare = oraAterizare;
        this.numarLocuriMaxim = numarLocuriMaxim;
        this.numarLocuriUtilizate = numarLocuriUtilizate;
        this.aeroportPlecareID = aeroportPlecareID;
        this.aeroportSosireID = aeroportSosireID;
    }
    // Constructor fără zborID (pentru adăugare)
    public Zbor(String oraDecolare, String oraAterizare,
                int numarLocuriMaxim, int numarLocuriUtilizate,
                int aeroportPlecareID, int aeroportSosireID) {
        this.oraDecolare = oraDecolare;
        this.oraAterizare = oraAterizare;
        this.numarLocuriMaxim = numarLocuriMaxim;
        this.numarLocuriUtilizate = numarLocuriUtilizate;
        this.aeroportPlecareID = aeroportPlecareID;
        this.aeroportSosireID = aeroportSosireID;
    }

    public Zbor() {
    }

    // Getters și Setters

    public int getZborID() {
        return zborID;
    }

    public void setZborID(int zborID) {
        this.zborID = zborID;
    }

    public String getOraDecolare() {
        return oraDecolare;
    }

    public void setOraDecolare(String oraDecolare) {
        this.oraDecolare = oraDecolare;
    }

    public String getOraAterizare() {
        return oraAterizare;
    }

    public void setOraAterizare(String oraAterizare) {
        this.oraAterizare = oraAterizare;
    }

    public int getNumarLocuriMaxim() {
        return numarLocuriMaxim;
    }

    public void setNumarLocuriMaxim(int numarLocuriMaxim) {
        this.numarLocuriMaxim = numarLocuriMaxim;
    }

    public int getNumarLocuriUtilizate() {
        return numarLocuriUtilizate;
    }

    public void setNumarLocuriUtilizate(int numarLocuriUtilizate) {
        this.numarLocuriUtilizate = numarLocuriUtilizate;
    }

    public int getAeroportPlecareID() {
        return aeroportPlecareID;
    }

    public void setAeroportPlecareID(int aeroportPlecareID) {
        this.aeroportPlecareID = aeroportPlecareID;
    }

    public int getAeroportSosireID() {
        return aeroportSosireID;
    }

    public void setAeroportSosireID(int aeroportSosireID) {
        this.aeroportSosireID = aeroportSosireID;
    }
}
