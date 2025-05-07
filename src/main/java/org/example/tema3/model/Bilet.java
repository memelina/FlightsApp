package org.example.tema3.model;

public class Bilet {
    private int biletID;
    private int zborID;
    private String dataCalatorie;
    private int aeroportDecolareID;
    private int aeroportAterizareID;
    private int numarLoc;
    private String numePasager;
    private int pret;

    // Constructor cu ID
    public Bilet(int biletID, int zborID, String dataCalatorie, int aeroportDecolareID,
                 int aeroportAterizareID, int numarLoc, String numePasager, int pret) {
        this.biletID = biletID;
        this.zborID = zborID;
        this.dataCalatorie = dataCalatorie;
        this.aeroportDecolareID = aeroportDecolareID;
        this.aeroportAterizareID = aeroportAterizareID;
        this.numarLoc = numarLoc;
        this.numePasager = numePasager;
        this.pret = pret;
    }

    // Constructor fără ID (pentru inserare)
    public Bilet(int zborID, String dataCalatorie, int aeroportDecolareID,
                 int aeroportAterizareID, int numarLoc, String numePasager, int pret) {
        this.zborID = zborID;
        this.dataCalatorie = dataCalatorie;
        this.aeroportDecolareID = aeroportDecolareID;
        this.aeroportAterizareID = aeroportAterizareID;
        this.numarLoc = numarLoc;
        this.numePasager = numePasager;
        this.pret = pret;
    }

    public Bilet() {}

    // Getters și Setters
    public int getBiletID() { return biletID; }
    public void setBiletID(int biletID) { this.biletID = biletID; }
    public int getZborID() { return zborID; }
    public void setZborID(int zborID) { this.zborID = zborID; }
    public String getDataCalatorie() { return dataCalatorie; }
    public void setDataCalatorie(String dataCalatorie) { this.dataCalatorie = dataCalatorie; }
    public int getAeroportDecolareID() { return aeroportDecolareID; }
    public void setAeroportDecolareID(int aeroportDecolareID) { this.aeroportDecolareID = aeroportDecolareID; }
    public int getAeroportAterizareID() { return aeroportAterizareID; }
    public void setAeroportAterizareID(int aeroportAterizareID) { this.aeroportAterizareID = aeroportAterizareID; }
    public int getNumarLoc() { return numarLoc; }
    public void setNumarLoc(int numarLoc) { this.numarLoc = numarLoc; }
    public String getNumePasager() { return numePasager; }
    public void setNumePasager(String numePasager) { this.numePasager = numePasager; }
    public int getPret() { return pret; }
    public void setPret(int pret) { this.pret = pret; }

}
