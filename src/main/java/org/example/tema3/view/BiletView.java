package org.example.tema3.view;

import org.example.tema3.model.Bilet;
import org.example.tema3.model.Observer;
import org.example.tema3.model.viewmodel.BiletViewModel;

import java.util.List;

public class BiletView implements Observer {
    private final BiletViewModel viewModel;

    public BiletView(BiletViewModel viewModel) {
        this.viewModel = viewModel;
    }

    @Override
    public void update() {
        afiseazaBilete();
    }

    public void afiseazaBilete() {
        List<Bilet> bilete = viewModel.getBilete();
        System.out.println("Lista biletelor din baza de date:");
        for (Bilet bilet : bilete) {
            System.out.println("Data: " + bilet.getDataCalatorie()+
                    ", ZborID: " + bilet.getZborID() +
                    ", Loc: " + bilet.getNumarLoc() +
                    ", Pasager: " + bilet.getNumePasager() +
                    ", Pret: " + bilet.getPret());
        }
        System.out.println();
    }
}