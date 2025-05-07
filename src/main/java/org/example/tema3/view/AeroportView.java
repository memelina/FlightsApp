package org.example.tema3.view;

import org.example.tema3.model.Aeroport;
import org.example.tema3.model.Observer;
import org.example.tema3.model.viewmodel.AeroportViewModel;

import java.util.List;

public class AeroportView implements Observer {
    private final AeroportViewModel viewModel;

    public AeroportView(AeroportViewModel viewModel) {
        this.viewModel = viewModel;
    }

    @Override
    public void update() {
        afiseazaAeroporturi();
    }

    public void afiseazaAeroporturi() {
        List<Aeroport> aeroporturi = viewModel.getAeroporturi();
        System.out.println("Lista aeroporturilor din baza de date:");
        for (Aeroport aeroport : aeroporturi) {
            System.out.println("ID: " + aeroport.getAeroportID() + ", Nume: " + aeroport.getNumeAeroport());
        }
        System.out.println();
    }
}
