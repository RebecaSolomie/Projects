module com.example.a7_map_final {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires javafx.base;
    requires java.desktop;
    requires java.sql;

    opens com.example.a7_map_final to javafx.fxml;
    exports com.example.a7_map_final;
}