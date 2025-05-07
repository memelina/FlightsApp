package org.example.tema3.controller;

import org.example.tema3.model.Bilet;
import org.example.tema3.model.BiletStatistics;
import org.example.tema3.model.ZborStatistics;
import org.example.tema3.model.viewmodel.BiletViewModel;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bilete")
public class BiletRestController {

    private final BiletViewModel viewModel;

    public BiletRestController(BiletViewModel viewModel) {
        this.viewModel = viewModel;
    }

    @GetMapping
    public List<Bilet> getAll() {
        return viewModel.getBilete();
    }

    @PostMapping
    public void add(@RequestBody Bilet bilet) {
        viewModel.adaugaBilet(bilet);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bilet> getById(@PathVariable int id) {
        Bilet bilet = viewModel.gasesteBiletDupaId(id);
        if (bilet != null) {
            return ResponseEntity.ok(bilet);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/filtru")
    public List<Bilet> filtreazaBilete(
            @RequestParam(required = false) Integer zborID,
            @RequestParam(required = false) String dataCalatorie,
            @RequestParam(required = false) Integer aeroportAterizareID
    ) {
        return viewModel.filtreazaBilete(zborID, dataCalatorie, aeroportAterizareID);
    }

    @GetMapping("/export/csv/{zborID}")
    public ResponseEntity<Resource> exportBileteCsv(@PathVariable int zborID) throws IOException {
        List<Bilet> bilete = viewModel.getBiletePentruZbor(zborID);

        String fileName = "bilete_zbor_" + zborID + ".csv";
        File csvFile = new File(fileName);

        try (PrintWriter writer = new PrintWriter(csvFile)) {
            writer.println("ID,Nume Pasager,Preț,Zbor ID,Data Călătorie,Aeroport Decolare,Aeroport Aterizare");

            for (Bilet b : bilete) {
                writer.printf("%d,%s,%d,%d,%s,%d,%d%n",
                        b.getBiletID(),
                        b.getNumePasager(),
                        b.getPret(),
                        b.getZborID(),
                        b.getDataCalatorie(),
                        b.getAeroportDecolareID(),
                        b.getAeroportAterizareID()
                );
            }
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(csvFile));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }

    @GetMapping("/export/doc/{zborID}")
    public ResponseEntity<Resource> exportBileteDoc(@PathVariable int zborID) throws IOException {
        List<Bilet> bilete = viewModel.getBiletePentruZbor(zborID);

        String fileName = "bilete_zbor_" + zborID + ".doc";
        File docFile = new File(fileName);

        try (PrintWriter writer = new PrintWriter(docFile)) {
            writer.println("Bilete pentru zborul #" + zborID);
            writer.println("=================================");
            writer.println();

            for (Bilet b : bilete) {
                writer.println("ID Bilet: " + b.getBiletID());
                writer.println("Pasager: " + b.getNumePasager());
                writer.println("Preț: " + b.getPret() + " RON");
                writer.println("Data călătorie: " + b.getDataCalatorie());
                writer.println("Aeroport plecare: " + b.getAeroportDecolareID());
                writer.println("Aeroport sosire: " + b.getAeroportAterizareID());
                writer.println("---------------------------------");
            }
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(docFile));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName)
                .contentType(MediaType.parseMediaType("application/msword"))
                .body(resource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable int id, @RequestBody Bilet bilet) {
        boolean updated = viewModel.modificaBilet(id, bilet);
        if (updated) {
            return ResponseEntity.ok("Bilet actualizat cu succes.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Biletul nu a fost găsit pentru actualizare.");
        }
    }
    @GetMapping("/statistici/bilete")
    public ResponseEntity<List<BiletStatistics>> getStatisticiBilete() {
        try {
            List<BiletStatistics> statistici = viewModel.getStatisticiBilete();
            return ResponseEntity.ok(statistici);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/statistici/zboruri")
    public ResponseEntity<List<ZborStatistics>> getStatisticiZboruri() {
        try {
            List<ZborStatistics> statistici = viewModel.getStatisticiZboruri();
            return ResponseEntity.ok(statistici);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/statistici/venit")
    public ResponseEntity<Map<String, Object>> getStatisticiVenit() {
        try {
            Map<String, Object> statistici = viewModel.getStatisticiVenit();
            return ResponseEntity.ok(statistici);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/statistici/grafic")
    public ResponseEntity<Map<String, Object>> getStatisticiGrafic() {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("biletePeZbor", viewModel.getStatisticiBilete());
            result.put("zboruriPopulare", viewModel.getStatisticiZboruri());
            result.put("venitTotal", viewModel.getStatisticiVenit().get("venitTotal"));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        boolean deleted = viewModel.stergeBilet(id);
        if (deleted) {
            return ResponseEntity.ok("Bilet șters cu succes.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Biletul nu a fost găsit pentru ștergere.");
        }
    }
}