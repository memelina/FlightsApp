package org.example.tema3.controller;

import org.example.tema3.model.Aeroport;
import org.example.tema3.model.viewmodel.AeroportViewModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aeroporturi")
public class AeroportRestController {

    private final AeroportViewModel viewModel;

    public AeroportRestController(AeroportViewModel viewModel) {
        this.viewModel = viewModel;
    }

    @GetMapping
    public List<Aeroport> getAll() {
        return viewModel.getAeroporturi();
    }

    @PostMapping
    public void add(@RequestBody Aeroport aeroport) {
        viewModel.adaugaAeroport(aeroport.getNumeAeroport());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable int id, @RequestBody Aeroport aeroport) {
        boolean updated = viewModel.modificaAeroport(id, aeroport.getNumeAeroport());
        if (updated) {
            return ResponseEntity.ok("Aeroport actualizat cu succes.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Aeroportul nu a fost găsit pentru actualizare.");
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        boolean deleted = viewModel.stergeAeroport(id);
        if (deleted) {
            return ResponseEntity.ok("Aeroport șters cu succes.");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Nu poți șterge aeroportul deoarece există zboruri asociate.");
        }
    }

}
