package org.example.tema3.controller;

import org.example.tema3.model.Zbor;
import org.example.tema3.model.viewmodel.ZborViewModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zboruri")
public class ZborRestController {

    private final ZborViewModel viewModel;

    public ZborRestController(ZborViewModel viewModel) {
        this.viewModel = viewModel;
    }

    @GetMapping
    public List<Zbor> getAll() {
        return viewModel.getZboruri();
    }

    @PostMapping
    public void add(@RequestBody Zbor zbor) {
        viewModel.adaugaZbor(zbor);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Zbor> getById(@PathVariable int id) {
        Zbor zbor = viewModel.gasesteZborDupaId(id);
        if (zbor != null) {
            return ResponseEntity.ok(zbor);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable int id, @RequestBody Zbor zbor) {
        boolean updated = viewModel.modificaZbor(id, zbor);
        if (updated) {
            return ResponseEntity.ok("Zbor actualizat cu succes.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Zborul nu a fost găsit pentru actualizare.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        boolean deleted = viewModel.stergeZbor(id);
        if (deleted) {
            return ResponseEntity.ok("Zbor șters cu succes.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Zborul nu a fost găsit pentru ștergere.");
        }
    }
}
