package org.example.tema3.view;

import org.example.tema3.model.Zbor;
import org.example.tema3.model.Observer;
import org.example.tema3.model.viewmodel.ZborViewModel;

import java.util.List;

public class ZborView implements Observer {
    private final ZborViewModel viewModel;

    public ZborView(ZborViewModel viewModel) {
        this.viewModel = viewModel;
    }

    @Override
    public void update() {
        afiseazaZboruri();
    }

    public void afiseazaZboruri() {
        List<Zbor> zboruri = viewModel.getZboruri();
        System.out.println("Lista zborurilor din baza de date:");
        for (Zbor zbor : zboruri) {
            System.out.println(
                    "ID: " + zbor.getZborID() +
                            ", Ora Decolare: " + zbor.getOraDecolare() +
                            ", Ora Aterizare: " + zbor.getOraAterizare() +
                            ", Locuri Max: " + zbor.getNumarLocuriMaxim() +
                            ", Locuri Utilizate: " + zbor.getNumarLocuriUtilizate() +
                            ", Aeroport Plecare ID: " + zbor.getAeroportPlecareID() +
                            ", Aeroport Sosire ID: " + zbor.getAeroportSosireID()
            );
        }
        System.out.println();
    }
}
