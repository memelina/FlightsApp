package org.example.tema3;

import org.example.tema3.model.viewmodel.AeroportViewModel;
import org.example.tema3.model.viewmodel.ZborViewModel;
import org.example.tema3.view.AeroportView;
import org.example.tema3.view.ZborView;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class Application implements CommandLineRunner {

    private final ApplicationContext context;

    public Application(ApplicationContext context) {
        this.context = context;
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) {
        JdbcTemplate jdbcTemplate = context.getBean(JdbcTemplate.class);

        // Aeroport setup
        //AeroportViewModel aeroportViewModel = new AeroportViewModel(jdbcTemplate);
        //AeroportView aeroportView = new AeroportView(aeroportViewModel);
        //aeroportViewModel.addObserver(aeroportView);

        // Zbor setup
       // ZborViewModel zborViewModel = new ZborViewModel(jdbcTemplate);
        //ZborView zborView = new ZborView(zborViewModel);
        //zborViewModel.addObserver(zborView);


        // Testare CRUD Aeroport
        // aeroportController.adaugaAeroport("Aeroport Cluj");
        // aeroportController.stergeAeroport(2);
        //aeroportController.modificaAeroport(1, "Aeroport Internațional Henri Coandă Bucuresti");

        // Testare CRUD Zbor
        // Adăugare zbor nou


        // Modificare zbor
       /* Zbor zborEditat = new Zbor(
            "11:00", "13:00", 200, 80, 1, 3
        );
        zborController.modificaZbor(1, zborEditat);

        // Ștergere zbor
        zborController.stergeZbor(1);
*/
    }
}
